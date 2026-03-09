const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/aiController');

// Public route — no auth needed for chatbot
router.post('/', chat);

module.exports = router;
