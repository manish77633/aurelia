const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/wishlistModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

// @desc  Get wishlist
// @route GET /api/wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
  if (!wishlist) return res.json({ products: [] });
  res.json(wishlist);
});

// @desc  Toggle wishlist item
// @route POST /api/wishlist/:productId
const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Validate productId format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error('Invalid product ID format');
  }

  // Confirm product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
    return res.json({ added: true, wishlist: await wishlist.populate('products') });
  }
  const idx = wishlist.products.findIndex(p => p.toString() === productId);
  let added;
  if (idx > -1) {
    wishlist.products.splice(idx, 1);
    added = false;
  } else {
    wishlist.products.push(productId);
    added = true;
  }
  await wishlist.save();
  const populated = await Wishlist.findById(wishlist._id).populate('products');
  res.json({ added, wishlist: populated });
});

module.exports = { getWishlist, toggleWishlist };
