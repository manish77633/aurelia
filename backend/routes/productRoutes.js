const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getRelatedProducts, createProduct, updateProduct, deleteProduct, createProductReview } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.get('/:id/related', getRelatedProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, upload.array('images', 10), createProduct);
router.put('/:id', protect, admin, upload.array('images', 10), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
