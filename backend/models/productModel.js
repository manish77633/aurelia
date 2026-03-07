const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Luxury Watches', 'Designer Bags', 'Premium Shoes', 'Exclusive Apparel'],
    },
    colors: [{ type: String }],
    image: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, default: false },
    reviews: [reviewSchema],
    numReviews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
