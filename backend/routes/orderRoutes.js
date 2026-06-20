const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { createOrder, getOrders, myOrders, updateOrderStatus } = require('../controllers/orderController');

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/myOrders').get(protect, myOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;