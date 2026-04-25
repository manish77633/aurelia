const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc  Create Razorpay order
// @route POST /api/payment/create-order
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  // Validate amount
  if (amount === undefined || amount === null || amount === '') {
    res.status(400);
    throw new Error('Amount is required');
  }
  const parsedAmount = Number(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    res.status(400);
    throw new Error('Amount must be a positive number');
  }
  // Razorpay minimum order amount is 1 INR (100 paise)
  if (parsedAmount < 1) {
    res.status(400);
    throw new Error('Minimum order amount is ₹1');
  }

  const options = {
    amount: Math.round(parsedAmount * 100), // convert to paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };
  const order = await razorpay.orders.create(options);
  res.json({
    orderId: order.id,
    currency: order.currency,
    amount: order.amount,
  });
});

// @desc  Verify Razorpay payment
// @route POST /api/payment/verify
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Validate required fields
  if (!razorpay_order_id) {
    res.status(400);
    throw new Error('razorpay_order_id is required');
  }
  if (!razorpay_payment_id) {
    res.status(400);
    throw new Error('razorpay_payment_id is required');
  }
  if (!razorpay_signature) {
    res.status(400);
    throw new Error('razorpay_signature is required');
  }

  // Validate field formats (basic string check)
  if (typeof razorpay_order_id !== 'string' || !razorpay_order_id.startsWith('order_')) {
    res.status(400);
    throw new Error('Invalid razorpay_order_id format');
  }
  if (typeof razorpay_payment_id !== 'string' || !razorpay_payment_id.startsWith('pay_')) {
    res.status(400);
    throw new Error('Invalid razorpay_payment_id format');
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');
  const isAuthentic = expectedSignature === razorpay_signature;
  if (isAuthentic) {
    res.json({ success: true, message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
});

module.exports = { createRazorpayOrder, verifyPayment };
