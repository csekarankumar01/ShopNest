const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
            const message = `
            Welcome to ShopNest, ${name}! Thank you for registering with us. We are excited to have you on board. To complete your registration, please use the following One-Time Password (OTP) for verification:
            Your OTP for ShopNest registration is: ${otp}`;

            // Fixed: Wrapped in a try/catch so missing email credentials won't crash your whole registration
            try {
                await sendEmail(email, 'Welcome to ShopNest - Your OTP for Registration', message);
            } catch (emailError) {
                console.log("Email server skipped or unconfigured. Error:", emailError.message);
            }

            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            return res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        // Fixed: Returning the real error message back so you can debug what failed
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Exclude password field
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser, getUsers };
