const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

const getUploadedImageUrl = async (file) => {
    if (!file) {
        return null;
    }

    const hasCloudinaryConfig = process.env.CLOUDINARY_CLOUD_NAME
        && process.env.CLOUDINARY_API_KEY
        && process.env.CLOUDINARY_API_SECRET;

    if (hasCloudinaryConfig) {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url;
    }

    return `/uploads/${file.filename}`;
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        
        // Handle image upload depending on Cloudinary config availability
        let imageUrls = [];
        const uploadedImageUrl = await getUploadedImageUrl(req.file);
        if (uploadedImageUrl) {
           imageUrls = [uploadedImageUrl];
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl: imageUrls
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ message: 'Server error' });
    }   
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;

            if (req.file) {
                const uploadedImageUrl = await getUploadedImageUrl(req.file);
                if (uploadedImageUrl) {
                    product.imageUrl = [uploadedImageUrl];
                }
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}; 

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
