const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const { cloudinary } = require('../middleware/uploadMiddleware');
const streamifier = require('streamifier');

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: 'aurelia-luxe-products' },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, color, minPrice, maxPrice, sort, featured, gender, subCategory, page = 1, limit = 12 } = req.query;
  const query = {};
  if (keyword) {
    const k = keyword.trim().toLowerCase();

    // Broad Category Aliases: only if search is a single broad word
    const broadFootwear = ['shoe', 'shoes', 'footwear'].includes(k);
    const broadApparel = ['shirt', 'tshirt', 't-shirt', 'apparel', 'clothing'].includes(k);
    const broadAccessory = ['bag', 'bags', 'watch', 'watches', 'accessory', 'accessories'].includes(k);

    if (broadFootwear) {
      query.category = 'Footwear';
    } else if (broadApparel) {
      query.category = 'Apparel';
    } else if (broadAccessory) {
      query.category = 'Accessories';
    } else {
      // Advanced Search: match any word in name, category, or subCategory
      const words = k.split(' ').filter(w => w.length > 1);
      const searchRegex = words.map(w => ({
        $or: [
          { name: { $regex: w, $options: 'i' } },
          { category: { $regex: w, $options: 'i' } },
          { subCategory: { $regex: w, $options: 'i' } },
          { description: { $regex: w, $options: 'i' } },
        ]
      }));

      if (searchRegex.length > 0) {
        query.$and = searchRegex;
      } else {
        query.name = { $regex: k, $options: 'i' };
      }
    }
  }

  // Handle Category (Match exactly if present and not 'All')
  if (category && category !== 'All') {
    query.category = { $regex: new RegExp(`^${category}$`, 'i') };
  }

  // Handle Gender (Strict matching)
  if (gender) {
    query.gender = gender;
  }

  // Handle Sub-category (Strict matching)
  if (subCategory) {
    query.subCategory = subCategory;
  }

  if (color && color !== 'All') query.colors = { $in: [new RegExp(color, 'i')] };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (featured === 'true') query.featured = true;

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'top_rated') sortOption = { rating: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const products = await Product.find(query).sort(sortOption).skip(skip).limit(Number(limit));
  const total = await Product.countDocuments(query);

  res.json({
    products,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total,
  });
});

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
});

// GET /api/products/:id/related
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const related = await Product.find({
    category: product.category,
    gender: product.gender,
    _id: { $ne: product._id },
  }).limit(4);

  res.json(related);
});

// POST /api/products  (admin — supports URL or file upload, multiple images)
const createProduct = asyncHandler(async (req, res) => {
  let { name, description, price, category, colors, countInStock, featured, image, imageUrls, mainImageIndex } = req.body;

  // Build images array from uploaded files + any URL-based images
  let allImages = [];

  // Uploaded files via Cloudinary streamifier
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const url = await streamUpload(file.buffer);
      allImages.push(url);
    }
  }

  // URL-based images (sent as JSON array string or comma-separated)
  if (imageUrls) {
    try {
      const urls = JSON.parse(imageUrls);
      if (Array.isArray(urls)) allImages = allImages.concat(urls);
    } catch {
      // comma-separated fallback
      allImages = allImages.concat(imageUrls.split(',').map(u => u.trim()).filter(Boolean));
    }
  }

  // Legacy single image field fallback
  if (allImages.length === 0 && image) {
    allImages.push(image);
  }

  if (allImages.length === 0) { res.status(400); throw new Error('At least one product image is required'); }

  // Determine main image
  const mainIdx = Number(mainImageIndex) || 0;
  const mainImage = allImages[mainIdx] || allImages[0];

  const colorsArray = typeof colors === 'string' ? colors.split(',').map(c => c.trim()) : colors || [];

  const product = await Product.create({
    name, description, price: Number(price), category,
    colors: colorsArray, image: mainImage, images: allImages,
    countInStock: Number(countInStock) || 10,
    featured: featured === 'true' || featured === true,
    seller: req.user._id,
  });
  res.status(201).json(product);
});

// PUT /api/products/:id  (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  let { name, description, price, category, colors, countInStock, featured, image, imageUrls, mainImageIndex, existingImages } = req.body;

  // Build images array
  let allImages = [];

  // Keep existing images if provided (sent as JSON array string)
  if (existingImages) {
    try {
      const kept = JSON.parse(existingImages);
      if (Array.isArray(kept)) allImages = allImages.concat(kept);
    } catch { }
  }

  // Add newly uploaded files via Cloudinary
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const url = await streamUpload(file.buffer);
      allImages.push(url);
    }
  }

  // Add URL-based images
  if (imageUrls) {
    try {
      const urls = JSON.parse(imageUrls);
      if (Array.isArray(urls)) allImages = allImages.concat(urls);
    } catch {
      allImages = allImages.concat(imageUrls.split(',').map(u => u.trim()).filter(Boolean));
    }
  }

  // Legacy single image field fallback
  if (allImages.length === 0 && image) {
    allImages.push(image);
  }

  // If still no images, keep existing
  if (allImages.length === 0) {
    allImages = product.images && product.images.length > 0 ? product.images : [product.image];
  }

  // Determine main image
  const mainIdx = Number(mainImageIndex) || 0;
  const mainImage = allImages[mainIdx] || allImages[0];

  const colorsArray = typeof colors === 'string' ? colors.split(',').map(c => c.trim()) : colors || product.colors;

  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price ? Number(price) : product.price;
  product.category = category ?? product.category;
  product.colors = colorsArray;
  product.image = mainImage;
  product.images = allImages;
  product.countInStock = countInStock ? Number(countInStock) : product.countInStock;
  product.featured = featured !== undefined ? (featured === 'true' || featured === true) : product.featured;

  const updated = await product.save();
  res.json(updated);
});

// DELETE /api/products/:id  (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

// POST /api/products/:id/reviews
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) { res.status(400); throw new Error('Already reviewed'); }
  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ message: 'Review added' });
});

module.exports = { getProducts, getProductById, getRelatedProducts, createProduct, updateProduct, deleteProduct, createProductReview };
