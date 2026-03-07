const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
// Cloudinary removed

// GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, color, minPrice, maxPrice, sort, featured } = req.query;
  const query = {};
  if (keyword) query.name = { $regex: keyword, $options: 'i' };
  if (category) query.category = category;
  if (color) query.colors = { $in: [new RegExp(color, 'i')] };
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

  const products = await Product.find(query).sort(sortOption);
  res.json(products);
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
    _id: { $ne: product._id },
  }).limit(4);
  res.json(related);
});

// POST /api/products  (admin — supports URL or file upload)
const createProduct = asyncHandler(async (req, res) => {
  let { name, description, price, category, colors, countInStock, featured, image } = req.body;

  // If file was uploaded, save local path
  if (req.file) {
    image = `/uploads/${req.file.filename}`;
  }

  if (!image) { res.status(400); throw new Error('Product image is required'); }

  const colorsArray = typeof colors === 'string' ? colors.split(',').map(c => c.trim()) : colors || [];

  const product = await Product.create({
    name, description, price: Number(price), category,
    colors: colorsArray, image,
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

  let { name, description, price, category, colors, countInStock, featured, image } = req.body;

  if (req.file) {
    image = `/uploads/${req.file.filename}`;
  }

  const colorsArray = typeof colors === 'string' ? colors.split(',').map(c => c.trim()) : colors || product.colors;

  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price ? Number(price) : product.price;
  product.category = category ?? product.category;
  product.colors = colorsArray;
  product.image = image ?? product.image;
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
