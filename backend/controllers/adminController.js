const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// @desc  Get dashboard stats
// @route GET /api/admin/stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  res.json({
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
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
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot delete admin user');
  }
  await user.deleteOne();
  res.json({ message: 'User removed' });
});

// @desc  Update user role (admin)
// @route PUT /api/admin/users/:id
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.role = req.body.role || user.role;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role });
});

module.exports = { getDashboardStats, getAllUsers, deleteUser, updateUserRole };
