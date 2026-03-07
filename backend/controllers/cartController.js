const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

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
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [{ product: productId, qty: qty || 1 }] });
  } else {
    const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].qty += qty || 1;
    } else {
      cart.items.push({ product: productId, qty: qty || 1 });
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
  if (qty <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].qty = qty;
  }
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.product');
  res.json(populated);
});

// @desc  Remove from cart
// @route DELETE /api/cart/:productId
const removeFromCart = asyncHandler(async (req, res) => {
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
