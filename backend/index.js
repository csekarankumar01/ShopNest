const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
dotenv.config();
connectDB();


const app = express();
const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',') : []),
  'http://localhost:3000',
].filter(Boolean).map((origin) => origin.trim().replace(/\/$/, ''));

app.use(cors({
  origin(origin, callback) {
    if (!origin || origin.endsWith('vercel.app') || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send("ShopNest Backend is working properly!");
});

// Test email route
app.get('/api/test-email', async (req, res) => {
    try {
        const nodemailer = require('nodemailer');
        const emailUser = process.env.EMAIL_USER || 'homelanderislive@gmail.com';
        const emailPass = process.env.EMAIL_PASS || 'qkohsedvopeaeisq';
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // TLS
            auth: { user: emailUser, pass: emailPass }
        });
        
        const info = await transporter.sendMail({
            from: emailUser,
            to: 'miet.karan.26@gmail.com',
            subject: 'Test Email from Render',
            text: 'If you receive this, emails are working.'
        });
        
        res.json({ success: true, info, envUser: emailUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, stack: error.stack });
    }
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentsRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


  
