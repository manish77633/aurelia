const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  registerUser, loginUser, getUserProfile,
  updateUserProfile, forgotPassword, resetPassword, googleCallback,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter, registerLimiter, forgotPasswordLimiter } = require('../middleware/rateLimiter');

router.post('/register', registerLimiter, registerUser);
router.post('/login', loginLimiter, loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login`, session: false }),
  googleCallback
);

module.exports = router;
