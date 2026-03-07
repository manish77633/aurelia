const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      },
    ],
    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
    paymentMethod: { type: String, required: true, default: 'Razorpay' },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      razorpay_order_id: String,
      razorpay_payment_id: String,
      razorpay_signature: String,
    },
    itemsPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    taxPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
