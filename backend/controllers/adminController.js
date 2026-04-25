const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

const VALID_ROLES = ['user', 'admin'];

// @desc  Get dashboard stats
// @route GET /api/admin/stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  // Revenue from paid orders (Razorpay) + delivered COD orders
  const totalRevenue = await Order.aggregate([
    { $match: { $or: [{ isPaid: true }, { paymentMethod: 'COD', status: 'Delivered' }] } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  // COD revenue (pending — not yet delivered)
  const codPending = await Order.aggregate([
    { $match: { paymentMethod: 'COD', status: { $nin: ['Delivered', 'Cancelled'] } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  // Daily revenue for the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const dailyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
        $or: [{ isPaid: true }, { paymentMethod: 'COD', status: 'Delivered' }]
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$totalPrice" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    codPendingRevenue: codPending[0]?.total || 0,
    dailyRevenue,
  });
});

// @desc  Get all users (admin)
// @route GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @desc  Delete user (admin)
// @route DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid user ID format');
  }

  // Prevent admin from deleting themselves
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot delete an admin user');
  }
  await user.deleteOne();
  res.json({ message: 'User removed' });
});

// @desc  Update user role (admin)
// @route PUT /api/admin/users/:id
const updateUserRole = asyncHandler(async (req, res) => {
  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid user ID format');
  }

  const { role } = req.body;

  // Validate role
  if (!role) {
    res.status(400);
    throw new Error('Role is required');
  }
  if (!VALID_ROLES.includes(role)) {
    res.status(400);
    throw new Error(`Role must be one of: ${VALID_ROLES.join(', ')}`);
  }

  // Prevent admin from changing their own role
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot change your own role');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.role = role;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role });
});

module.exports = { getDashboardStats, getAllUsers, deleteUser, updateUserRole };
