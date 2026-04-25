const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

// @desc  Get cart
// @route GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) return res.json({ items: [] });
  res.json(cart);
});

// @desc  Add to cart
// @route POST /api/cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;

  // Validate productId
  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error('Invalid product ID format');
  }

  // Validate qty
  const parsedQty = Number(qty);
  if (qty !== undefined && (!Number.isInteger(parsedQty) || parsedQty < 1)) {
    res.status(400);
    throw new Error('Quantity must be a positive integer');
  }
  if (parsedQty > 100) {
    res.status(400);
    throw new Error('Quantity cannot exceed 100');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check stock availability
  const requestedQty = parsedQty || 1;
  if (product.countInStock < requestedQty) {
    res.status(400);
    throw new Error(`Only ${product.countInStock} unit(s) available in stock`);
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [{ product: productId, qty: requestedQty }] });
  } else {
    const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].qty + requestedQty;
      if (newQty > product.countInStock) {
        res.status(400);
        throw new Error(`Cannot add more. Only ${product.countInStock} unit(s) available in stock`);
      }
      cart.items[itemIndex].qty = newQty;
    } else {
      cart.items.push({ product: productId, qty: requestedQty });
    }
    await cart.save();
  }
  const populated = await Cart.findById(cart._id).populate('items.product');
  res.json(populated);
});

// @desc  Update cart item qty
// @route PUT /api/cart/:productId
const updateCartItem = asyncHandler(async (req, res) => {
  const { qty } = req.body;

  // Validate productId param
  if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
    res.status(400);
    throw new Error('Invalid product ID format');
  }

  // Validate qty
  if (qty === undefined || qty === null || qty === '') {
    res.status(400);
    throw new Error('Quantity is required');
  }
  const parsedQty = Number(qty);
  if (!Number.isInteger(parsedQty) || parsedQty < 0) {
    res.status(400);
    throw new Error('Quantity must be a non-negative integer (0 to remove)');
  }
  if (parsedQty > 100) {
    res.status(400);
    throw new Error('Quantity cannot exceed 100');
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  const itemIndex = cart.items.findIndex((i) => i.product.toString() === req.params.productId);
  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Item not in cart');
  }

  if (parsedQty <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    // Check stock
    const product = await Product.findById(req.params.productId);
    if (product && parsedQty > product.countInStock) {
      res.status(400);
      throw new Error(`Only ${product.countInStock} unit(s) available in stock`);
    }
    cart.items[itemIndex].qty = parsedQty;
  }
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.product');
  res.json(populated);
});

// @desc  Remove from cart
// @route DELETE /api/cart/:productId
const removeFromCart = asyncHandler(async (req, res) => {
  // Validate productId param
  if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
    res.status(400);
    throw new Error('Invalid product ID format');
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.product');
  res.json(populated);
});

// @desc  Clear cart
// @route DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
