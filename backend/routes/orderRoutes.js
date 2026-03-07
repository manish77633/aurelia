// orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, getMyOrders, updateOrderToPaid, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);
router.post('/', protect, createOrder);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
