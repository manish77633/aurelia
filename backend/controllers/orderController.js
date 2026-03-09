const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const nodemailer = require('nodemailer');

// Email transporter
const getTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Status-specific email content
const STATUS_EMAIL = {
  'Confirmed': { emoji: '✅', subject: 'Order Confirmed!', msg: 'Your order has been confirmed and is being prepared.' },
  'Shipped': { emoji: '📦', subject: 'Order Shipped!', msg: 'Your order has been shipped and is on its way to you.' },
  'Out for Delivery': { emoji: '🚚', subject: 'Out for Delivery!', msg: 'Your order is out for delivery. It will reach you soon!' },
  'Delivered': { emoji: '🎉', subject: 'Order Delivered!', msg: 'Your order has been delivered. We hope you love it!' },
  'Cancelled': { emoji: '❌', subject: 'Order Cancelled', msg: 'Your order has been cancelled. If you have questions, please contact support.' },
};

const sendStatusEmail = async (order, status) => {
  try {
    const info = STATUS_EMAIL[status];
    if (!info || !order.user?.email) return;

    const transporter = getTransporter();
    const itemsHtml = order.orderItems.map(i =>
      `<tr><td style="padding:8px 12px;border-bottom:1px solid #f0ebe3;font-size:14px;">${i.name}</td><td style="padding:8px 12px;border-bottom:1px solid #f0ebe3;text-align:center;">${i.qty}</td><td style="padding:8px 12px;border-bottom:1px solid #f0ebe3;text-align:right;font-weight:600;color:#CFA052;">$${i.price.toFixed(2)}</td></tr>`
    ).join('');

    await transporter.sendMail({
      from: `"Aurelia Luxe" <${process.env.EMAIL_USER}>`,
      to: order.user.email,
      subject: `${info.emoji} ${info.subject} — Order #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif;background:#fafafa;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1A1A1A,#2d2620);padding:32px 24px;text-align:center;">
            <div style="font-size:36px;margin-bottom:12px;">${info.emoji}</div>
            <h1 style="color:#CFA052;font-size:22px;margin:0 0 4px;">Aurelia Luxe</h1>
            <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;">Premium Marketplace</p>
          </div>
          <div style="padding:28px 24px;">
            <h2 style="color:#1A1A1A;font-size:20px;margin:0 0 8px;">${info.subject}</h2>
            <p style="color:#6B7280;font-size:14px;line-height:1.6;margin:0 0 20px;">Hi ${order.user.name || 'there'}, ${info.msg}</p>
            <div style="background:#fff;border:1px solid #f0ebe3;border-radius:12px;padding:16px;margin-bottom:20px;">
              <div style="font-size:12px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Order #${order._id.toString().slice(-8).toUpperCase()}</div>
              <div style="display:inline-block;background:${status === 'Delivered' ? '#dcfce7' : status === 'Cancelled' ? '#fef2f2' : '#fef9ec'};color:${status === 'Delivered' ? '#166534' : status === 'Cancelled' ? '#b91c1c' : '#92400e'};font-size:12px;font-weight:700;padding:4px 12px;border-radius:999px;">${status}</div>
              <table style="width:100%;border-collapse:collapse;margin-top:16px;">
                <thead><tr style="border-bottom:2px solid #f0ebe3;"><th style="padding:8px 12px;text-align:left;font-size:12px;color:#9CA3AF;text-transform:uppercase;">Item</th><th style="padding:8px 12px;text-align:center;font-size:12px;color:#9CA3AF;">Qty</th><th style="padding:8px 12px;text-align:right;font-size:12px;color:#9CA3AF;">Price</th></tr></thead>
                <tbody>${itemsHtml}</tbody>
              </table>
              <div style="border-top:2px solid #f0ebe3;margin-top:8px;padding-top:12px;display:flex;justify-content:space-between;font-size:16px;font-weight:700;">
                <span>Total</span><span style="color:#CFA052;">$${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            ${order.shippingAddress ? `<div style="background:#fff;border:1px solid #f0ebe3;border-radius:12px;padding:16px;margin-bottom:20px;"><div style="font-size:12px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Shipping To</div><p style="color:#4B5563;font-size:14px;margin:0;line-height:1.6;">${order.shippingAddress.address}<br>${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>${order.shippingAddress.country}</p></div>` : ''}
            <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;">Payment: <strong>${order.paymentMethod}</strong></p>
          </div>
          <div style="background:#f5f0e8;padding:16px 24px;text-align:center;font-size:12px;color:#9CA3AF;">
            Thank you for shopping with <strong style="color:#CFA052;">Aurelia Luxe</strong> 💎
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Status email failed:', err.message);
  }
};

// @desc  Create order
// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, paymentResult } = req.body;
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems, shippingAddress, paymentMethod,
    itemsPrice, shippingPrice, taxPrice, totalPrice,
    // For Razorpay paid orders
    isPaid: paymentResult?.status === 'paid',
    paidAt: paymentResult?.status === 'paid' ? Date.now() : undefined,
    paymentResult: paymentResult || undefined,
    status: paymentMethod === 'COD' ? 'Processing' : (paymentResult?.status === 'paid' ? 'Processing' : 'Pending'),
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

// @desc  Update order status (admin) + send email notification
// @route PUT /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const newStatus = req.body.status;
  order.status = newStatus;

  // Mark as delivered
  if (newStatus === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    // For COD orders, mark as paid on delivery
    if (order.paymentMethod === 'COD' && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
    }
  }

  // For COD, mark confirmed means accepted
  if (newStatus === 'Confirmed' && order.paymentMethod === 'COD') {
    // COD orders marked paid only on delivery, but confirmed means accepted
  }

  const updated = await order.save();

  // Send email notification
  sendStatusEmail(order, newStatus);

  res.json(updated);
});

module.exports = { createOrder, getOrderById, getMyOrders, updateOrderToPaid, getAllOrders, updateOrderStatus };

