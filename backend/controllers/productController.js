const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const { cloudinary } = require('../middleware/uploadMiddleware');
const streamifier = require('streamifier');
const mongoose = require('mongoose');

const VALID_CATEGORIES = ['Footwear', 'Apparel', 'Accessories', 'Watches', 'Bags'];
const VALID_GENDERS = ['Men', 'Women', 'Unisex'];

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

  // Validate pagination params
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    res.status(400);
    throw new Error('Page must be a positive integer');
  }
  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    res.status(400);
    throw new Error('Limit must be between 1 and 100');
  }

  // Validate price range
  if (minPrice !== undefined && (isNaN(Number(minPrice)) || Number(minPrice) < 0)) {
    res.status(400);
    throw new Error('minPrice must be a non-negative number');
  }
  if (maxPrice !== undefined && (isNaN(Number(maxPrice)) || Number(maxPrice) < 0)) {
    res.status(400);
    throw new Error('maxPrice must be a non-negative number');
  }
  if (minPrice !== undefined && maxPrice !== undefined && Number(minPrice) > Number(maxPrice)) {
    res.status(400);
    throw new Error('minPrice cannot be greater than maxPrice');
  }

  // Validate gender filter
  if (gender && !VALID_GENDERS.includes(gender)) {
    res.status(400);
    throw new Error(`Gender must be one of: ${VALID_GENDERS.join(', ')}`);
  }

  const query = {};
  if (keyword) {
    const k = keyword.trim().toLowerCase();

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

  if (category && category !== 'All') {
    query.category = { $regex: new RegExp(`^${category}$`, 'i') };
  }
  if (gender) {
    query.gender = gender;
  }
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

  const skip = (parsedPage - 1) * parsedLimit;
  const products = await Product.find(query).sort(sortOption).skip(skip).limit(parsedLimit);
  const total = await Product.countDocuments(query);

  res.json({
    products,
    page: parsedPage,
    pages: Math.ceil(total / parsedLimit),
    total,
  });
});

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID format');
  }
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
});

// GET /api/products/:id/related
const getRelatedProducts = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID format');
  }
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const related = await Product.find({
    category: product.category,
    gender: product.gender,
    _id: { $ne: product._id },
  }).limit(4);

  res.json(related);
});

// POST /api/products  (admin)
const createProduct = asyncHandler(async (req, res) => {
  let { name, description, price, category, colors, countInStock, featured, image, imageUrls, mainImageIndex, gender, subCategory } = req.body;

  // Validate required fields
  if (!name || typeof name !== 'string' || name.trim() === '') {
    res.status(400);
    throw new Error('Product name is required');
  }
  if (name.trim().length > 100) {
    res.status(400);
    throw new Error('Product name cannot exceed 100 characters');
  }
  if (!description || typeof description !== 'string' || description.trim() === '') {
    res.status(400);
    throw new Error('Product description is required');
  }
  if (!price && price !== 0) {
    res.status(400);
    throw new Error('Product price is required');
  }
  if (isNaN(Number(price)) || Number(price) < 0) {
    res.status(400);
    throw new Error('Price must be a non-negative number');
  }
  if (!category || typeof category !== 'string' || category.trim() === '') {
    res.status(400);
    throw new Error('Product category is required');
  }

  // Validate gender if provided
  if (gender && !VALID_GENDERS.includes(gender)) {
    res.status(400);
    throw new Error(`Gender must be one of: ${VALID_GENDERS.join(', ')}`);
  }

  // Validate countInStock
  if (countInStock !== undefined) {
    const stock = Number(countInStock);
    if (!Number.isInteger(stock) || stock < 0) {
      res.status(400);
      throw new Error('Stock count must be a non-negative integer');
    }
  }

  // Build images array from uploaded files + any URL-based images
  let allImages = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const url = await streamUpload(file.buffer);
      allImages.push(url);
    }
  }

  if (imageUrls) {
    try {
      const urls = JSON.parse(imageUrls);
      if (Array.isArray(urls)) allImages = allImages.concat(urls);
    } catch {
      allImages = allImages.concat(imageUrls.split(',').map(u => u.trim()).filter(Boolean));
    }
  }

  if (allImages.length === 0 && image) {
    allImages.push(image);
  }

  if (allImages.length === 0) { res.status(400); throw new Error('At least one product image is required'); }

  const mainIdx = Number(mainImageIndex) || 0;
  const mainImage = allImages[mainIdx] || allImages[0];

  const colorsArray = typeof colors === 'string' ? colors.split(',').map(c => c.trim()).filter(Boolean) : (Array.isArray(colors) ? colors : []);

  const product = await Product.create({
    name: name.trim(), description: description.trim(), price: Number(price), category: category.trim(),
    colors: colorsArray, image: mainImage, images: allImages,
    countInStock: Number(countInStock) || 10,
    featured: featured === 'true' || featured === true,
    gender: gender || 'Unisex',
    subCategory: subCategory || undefined,
    seller: req.user._id,
  });
  res.status(201).json(product);
});

// PUT /api/products/:id  (admin)
const updateProduct = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID format');
  }

  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  let { name, description, price, category, colors, countInStock, featured, image, imageUrls, mainImageIndex, existingImages, gender, subCategory } = req.body;

  // Validate fields if provided
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      res.status(400); throw new Error('Product name cannot be empty');
    }
    if (name.trim().length > 100) {
      res.status(400); throw new Error('Product name cannot exceed 100 characters');
    }
  }
  if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
    res.status(400); throw new Error('Product description cannot be empty');
  }
  if (price !== undefined) {
    if (isNaN(Number(price)) || Number(price) < 0) {
      res.status(400); throw new Error('Price must be a non-negative number');
    }
  }
  if (countInStock !== undefined) {
    const stock = Number(countInStock);
    if (!Number.isInteger(stock) || stock < 0) {
      res.status(400); throw new Error('Stock count must be a non-negative integer');
    }
  }
  if (gender !== undefined && !VALID_GENDERS.includes(gender)) {
    res.status(400); throw new Error(`Gender must be one of: ${VALID_GENDERS.join(', ')}`);
  }

  // Build images array
  let allImages = [];

  if (existingImages) {
    try {
      const kept = JSON.parse(existingImages);
      if (Array.isArray(kept)) allImages = allImages.concat(kept);
    } catch { }
  }

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const url = await streamUpload(file.buffer);
      allImages.push(url);
    }
  }

  if (imageUrls) {
    try {
      const urls = JSON.parse(imageUrls);
      if (Array.isArray(urls)) allImages = allImages.concat(urls);
    } catch {
      allImages = allImages.concat(imageUrls.split(',').map(u => u.trim()).filter(Boolean));
    }
  }

  if (allImages.length === 0 && image) {
    allImages.push(image);
  }

  if (allImages.length === 0) {
    allImages = product.images && product.images.length > 0 ? product.images : [product.image];
  }

  const mainIdx = Number(mainImageIndex) || 0;
  const mainImage = allImages[mainIdx] || allImages[0];

  const colorsArray = typeof colors === 'string'
    ? colors.split(',').map(c => c.trim()).filter(Boolean)
    : (Array.isArray(colors) ? colors : product.colors);

  product.name = name !== undefined ? name.trim() : product.name;
  product.description = description !== undefined ? description.trim() : product.description;
  product.price = price !== undefined ? Number(price) : product.price;
  product.category = category !== undefined ? category.trim() : product.category;
  product.colors = colorsArray;
  product.image = mainImage;
  product.images = allImages;
  product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;
  product.featured = featured !== undefined ? (featured === 'true' || featured === true) : product.featured;
  product.gender = gender !== undefined ? gender : product.gender;
  product.subCategory = subCategory !== undefined ? subCategory : product.subCategory;

  const updated = await product.save();
  res.json(updated);
});

// DELETE /api/products/:id  (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID format');
  }
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

// POST /api/products/:id/reviews
const createProductReview = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID format');
  }

  const { rating, comment } = req.body;

  // Validate rating
  if (rating === undefined || rating === null || rating === '') {
    res.status(400);
    throw new Error('Rating is required');
  }
  const parsedRating = Number(rating);
  if (isNaN(parsedRating) || !Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    res.status(400);
    throw new Error('Rating must be an integer between 1 and 5');
  }

  // Validate comment
  if (!comment || typeof comment !== 'string' || comment.trim() === '') {
    res.status(400);
    throw new Error('Review comment is required');
  }
  if (comment.trim().length > 1000) {
    res.status(400);
    throw new Error('Review comment cannot exceed 1000 characters');
  }

  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) { res.status(400); throw new Error('You have already reviewed this product'); }
  product.reviews.push({ user: req.user._id, name: req.user.name, rating: parsedRating, comment: comment.trim() });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ message: 'Review added' });
});

module.exports = { getProducts, getProductById, getRelatedProducts, createProduct, updateProduct, deleteProduct, createProductReview };
