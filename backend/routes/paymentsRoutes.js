const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentsController.js');
const router = express.Router();

router.post("/order", createOrder);
router.post("/verify", verifyPayment);
router.post("/payment", verifyPayment);

module.exports = router;
