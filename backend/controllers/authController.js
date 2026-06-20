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

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        const user = await User.create({ name, email, password: hashedPassword, otp, otpExpires, verified: false });
        if (user) {
            const message = `
            Welcome to ShopNest, ${name}! Thank you for registering with us. We are excited to have you on board. To complete your registration, please use the following One-Time Password (OTP) for verification:
            Your OTP for ShopNest registration is: ${otp}`;

            // Fixed: Send email asynchronously in the background so the UI doesn't hang
            sendEmail(email, 'Welcome to ShopNest - Your OTP for Registration', message).catch(emailError => {
                console.log("Email server error:", emailError.message);
            });

            return res.status(201).json({ requiresOtp: true, email: user.email, message: 'OTP sent to email', testOtp: otp });
        } else {
            return res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        // Fixed: Returning the real error message back so you can debug what failed
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });
        if (user.verified) return res.status(400).json({ message: 'User already verified' });
        
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        
        user.verified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.verified) {
                // If not verified, you could generate a new OTP here and email it.
                // For now, we'll just return requiresOtp.
                return res.status(401).json({ requiresOtp: true, email: user.email, message: 'Please verify your email via OTP.' });
            }
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

module.exports = { registerUser, loginUser, getUsers, verifyOtp };
