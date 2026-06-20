const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { items, address, paymentId } = req.body;
        
        if (!items || items.length === 0 || !address) {
            return res.status(400).json({ message: 'Invalid order data' });
        }

        // Calculate total amount and map request items to the Order schema
        let calculatedTotalAmount = 0;
        const formattedProducts = items.map(item => {
            const price = Number(item.price || 0);
            const quantity = Number(item.quantity || item.qty || 1); 
            
            calculatedTotalAmount += price * quantity;

            return {
                product: item.product,
                quantity: quantity,
                price: price
            };
        });

        // Parse stringified address object if needed
        let finalAddress = typeof address === 'object' ? address : {};
        if (typeof address === 'string') {
            const parts = address.split(',').map(p => p.trim());
            finalAddress = {
                fullName: req.user?.name || "Customer",
                street: parts[0] || "",
                city: parts[1] || "",
                state: parts[2] || "",
                country: parts[3] || "India"
            };
        }

        const order = new Order({
            user: req.user._id,
            products: formattedProducts,
            totalAmount: calculatedTotalAmount,
            address: finalAddress,
            paymentId,
        });
        
        await order.save();

        // Deduct ordered items from product stock
        for (const item of formattedProducts) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock = Math.max(0, product.stock - item.quantity);
                await product.save();
            }
        }
        
        // Notify customer
        const message = `Dear ${req.user.name},\n\nThank you for your order! We are excited to inform you that your order has been successfully created with the following details:\n\nOrder ID: ${order._id}\nTotal Amount: $${calculatedTotalAmount}\n\nBest Regards,\nShopNest Team`;
        
        sendEmail(req.user.email, 'Order Confirmation - ShopNest', message).catch(err => {
            console.error("Order confirmation email failed to send:", err.message);
        });

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Order not found.', error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const status = String(req.body.status || '').toLowerCase();
        if (!['pending', 'shipped', 'delivered'].includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            await order.save();
            res.json({ message: 'Order status updated successfully', order });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

module.exports = { createOrder, myOrders, getOrders, updateOrderStatus };
