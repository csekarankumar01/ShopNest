const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { items, address, paymentId } = req.body;
        
        if (!items || items.length === 0 || !address) {
            return res.status(400).json({ message: 'Invalid order data' });
        }

        // Necessary Change: Dynamic loop calculation that fixes the 'qty' to 'quantity' schema mapping
        let calculatedTotalAmount = 0;
        const formattedProducts = items.map(item => {
            const price = Number(item.price || 0);
            // Fallback check to safely capture either 'quantity' or 'qty' from request
            const quantity = Number(item.quantity || item.qty || 1); 
            
            calculatedTotalAmount += price * quantity;

            return {
                product: item.product,
                quantity: quantity, // Maps securely to your schema's required 'quantity' path
                price: price
            };
        });

        // Necessary Change: Safely handle both flat string and nested object address structures
        let finalAddress = {};
        if (typeof address === 'object') {
            finalAddress = address;
        } else if (typeof address === 'string') {
            // Parses a comma-separated string back into schema validation properties if needed
            const parts = address.split(',').map(p => p.trim());
            finalAddress = {
                fullName: req.user?.name || "Customer",
                street: parts[0] || "Street Details Missing",
                city: parts[1] || "City Missing",
                state: parts[2] || "State Missing",
                country: parts[3] || "India"
            };
        }

        const order = new Order({
            user: req.user._id,
            products: formattedProducts,
            totalAmount: calculatedTotalAmount,
            address: finalAddress, // Saves as a valid sub-document object matching your schema
            paymentId,
        });
        
        await order.save();
        
        const message = `Dear ${req.user.name},\n\nThank you for your order! We are excited to inform you that your order has been successfully created with the following details:\n\nOrder ID: ${order._id}\nTotal Amount: $${calculatedTotalAmount}\n\nBest Regards,\nShopNest Team`;
        
        try {
            await sendEmail(req.user.email, 'Order Created', message);
        } catch (emailError) {
            console.log("Email service skipped. Order saved successfully.");
        }

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
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
