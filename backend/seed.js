const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config({ path: path.join(__dirname, '.env') });

const imageUrl = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';

const dummyUsers = [
    {
        name: 'Admin User',
        email: 'admin@shopnest.com',
        password: 'Admin@123',
        role: 'admin',
        verified: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'User@123',
        role: 'user',
        verified: true,
    },
    {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'User@123',
        role: 'user',
        verified: true,
    },
    {
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: 'User@123',
        role: 'user',
        verified: true,
    },
];

const dummyProducts = [
    {
        name: 'iPhone 15',
        description: 'Apple smartphone with A16 Bionic chip and advanced camera system.',
        price: 79999,
        category: 'Mobiles',
        stock: 20,
        imageUrl: [imageUrl],
        rating: 4.8,
        numReviews: 75,
    },
    {
        name: 'Samsung Galaxy S24',
        description: 'Android flagship phone with AMOLED display and fast performance.',
        price: 69999,
        category: 'Mobiles',
        stock: 18,
        imageUrl: [imageUrl],
        rating: 4.6,
        numReviews: 58,
    },
    {
        name: 'MacBook Air M2',
        description: 'Lightweight Apple laptop with M2 chip and all-day battery life.',
        price: 99999,
        category: 'Laptops',
        stock: 10,
        imageUrl: [imageUrl],
        rating: 4.9,
        numReviews: 92,
    },
    {
        name: 'Dell XPS 13',
        description: 'Premium Windows laptop with compact design and sharp display.',
        price: 89999,
        category: 'Laptops',
        stock: 12,
        imageUrl: [imageUrl],
        rating: 4.5,
        numReviews: 36,
    },
    {
        name: 'Sony WH-1000XM5 Headphones',
        description: 'Wireless noise-cancelling headphones with excellent sound quality.',
        price: 29999,
        category: 'Audio',
        stock: 25,
        imageUrl: [imageUrl],
        rating: 4.8,
        numReviews: 64,
    },
    {
        name: 'JBL Flip 6 Speaker',
        description: 'Portable Bluetooth speaker with waterproof design and deep bass.',
        price: 10999,
        category: 'Audio',
        stock: 35,
        imageUrl: [imageUrl],
        rating: 4.4,
        numReviews: 44,
    },
    {
        name: 'Nike Air Max Sneakers',
        description: 'Comfortable everyday sneakers with responsive cushioning.',
        price: 8999,
        category: 'Footwear',
        stock: 40,
        imageUrl: [imageUrl],
        rating: 4.3,
        numReviews: 29,
    },
    {
        name: 'Adidas Running Shoes',
        description: 'Lightweight running shoes designed for daily training.',
        price: 7499,
        category: 'Footwear',
        stock: 32,
        imageUrl: [imageUrl],
        rating: 4.2,
        numReviews: 21,
    },
    {
        name: 'Samsung 55 Inch 4K Smart TV',
        description: 'Ultra HD smart TV with vivid colors and built-in streaming apps.',
        price: 54999,
        category: 'Electronics',
        stock: 8,
        imageUrl: [imageUrl],
        rating: 4.6,
        numReviews: 33,
    },
    {
        name: 'Apple Watch Series 9',
        description: 'Smart watch with fitness tracking, notifications, and health features.',
        price: 41999,
        category: 'Wearables',
        stock: 16,
        imageUrl: [imageUrl],
        rating: 4.7,
        numReviews: 50,
    },
];

const createDummyOrders = (users, products) => [
    {
        user: users[1]._id,
        products: [
            {
                product: products[0]._id,
                quantity: 1,
                price: products[0].price,
            },
            {
                product: products[4]._id,
                quantity: 1,
                price: products[4].price,
            },
        ],
        totalAmount: products[0].price + products[4].price,
        address: {
            fullName: users[1].name,
            street: '101 MG Road',
            city: 'Bengaluru',
            postalCode: '560001',
            country: 'India',
        },
        paymentId: 'seed_payment_john_001',
        status: 'pending',
    },
    {
        user: users[2]._id,
        products: [
            {
                product: products[6]._id,
                quantity: 2,
                price: products[6].price,
            },
        ],
        totalAmount: products[6].price * 2,
        address: {
            fullName: users[2].name,
            street: '221 Market Street',
            city: 'Mumbai',
            postalCode: '400001',
            country: 'India',
        },
        paymentId: 'seed_payment_rahul_001',
        status: 'shipped',
    },
    {
        user: users[3]._id,
        products: [
            {
                product: products[9]._id,
                quantity: 1,
                price: products[9].price,
            },
        ],
        totalAmount: products[9].price,
        address: {
            fullName: users[3].name,
            street: '18 Park Avenue',
            city: 'Ahmedabad',
            postalCode: '380015',
            country: 'India',
        },
        paymentId: 'seed_payment_priya_001',
        status: 'delivered',
    },
];

const hashPasswords = async (users) => {
    return Promise.all(
        users.map(async (user) => ({
            ...user,
            password: await bcrypt.hash(user.password, 10),
        }))
    );
};

const seedDatabase = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing in backend/.env');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding');

        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        console.log('Cleared existing data');

        const usersWithHashedPasswords = await hashPasswords(dummyUsers);
        const createdUsers = await User.insertMany(usersWithHashedPasswords);
        const createdProducts = await Product.insertMany(dummyProducts);
        const createdOrders = await Order.insertMany(
            createDummyOrders(createdUsers, createdProducts)
        );

        console.log(`[OK] Seeded ${createdUsers.length} users`);
        console.log(`[OK] Seeded ${createdProducts.length} products`);
        console.log(`[OK] Seeded ${createdOrders.length} orders`);
        console.log('');
        console.log('Database seeded successfully!');
        console.log('');
        console.log('Login Credentials:');
        console.log('Admin: admin@shopnest.com / Admin@123');
        console.log('User:  john@example.com / User@123');
    } catch (error) {
        console.error('Seeding failed:', error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

seedDatabase();
