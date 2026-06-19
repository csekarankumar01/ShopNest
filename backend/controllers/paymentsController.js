const Razorpay = require('razorpay');
const crypto = require('crypto');
dotenv = require('dotenv').config();

const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({ message: "Invalid payment amount" });
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ message: "Razorpay keys are not configured" });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(Number(amount) * 100), // Amount in paise
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString('hex'),
        };
        const order = await instance.orders.create(options);
        res.json({ ...order, key: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        res.status(500).json({ message: "Payment order creation failed", error: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            res.json({ message: "Payment verified successfully" });
        } else {
            res.status(400).json({ message: "Invalid signature" });
        }
    } catch (error) {
            res.status(500).json({ message: "Payment verification failed", error: error.message });
    }
};

module.exports = { createOrder, verifyPayment };
