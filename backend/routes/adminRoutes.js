const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, deleteUser, updateUserRole } = require('../controllers/adminController');
const { generateDescription } = require('../controllers/aiController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id', protect, admin, updateUserRole);
router.post('/generate-description', protect, admin, generateDescription);

module.exports = router;

