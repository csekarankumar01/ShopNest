const express = require('express');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const upload = multer({ dest: path.join(__dirname, '../uploads') });


const router = express.Router(); 

router.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProduct);
router.route('/:id').get(getProductById).put(protect, admin, upload.single('image'), updateProduct).delete(protect, admin, deleteProduct);


module.exports = router;
