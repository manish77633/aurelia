const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');

// @desc  Create order
// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }
  const order = await Order.create({
    user: req.user._id,
    orderItems, shippingAddress, paymentMethod,
    itemsPrice, shippingPrice, taxPrice, totalPrice,
  });
  res.status(201).json(order);
});

// @desc  Get order by ID
// @route GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }
  res.json(order);
});

// @desc  Get my orders
// @route GET /api/orders/my
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc  Mark order as paid
// @route PUT /api/orders/:id/pay
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'Processing';
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    razorpay_order_id: req.body.razorpay_order_id,
    razorpay_payment_id: req.body.razorpay_payment_id,
    razorpay_signature: req.body.razorpay_signature,
  };
  const updated = await order.save();
  res.json(updated);
});

// @desc  Get all orders (admin)
// @route GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

// @desc  Update order status (admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = req.body.status;
  if (req.body.status === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  const updated = await order.save();
  res.json(updated);
});

module.exports = { createOrder, getOrderById, getMyOrders, updateOrderToPaid, getAllOrders, updateOrderStatus };
