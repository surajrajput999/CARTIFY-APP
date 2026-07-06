const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// 1. GET API: Products with search, category filter & pagination
router.get('/', async (req, res) => {
    try {
        const { search, category, page, limit } = req.query;
        const query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        if (category && category !== 'all') {
            query.category = category;
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 12;
        const skip = (pageNum - 1) * limitNum;

        const products = await Product.find(query).skip(skip).limit(limitNum);
        const total = await Product.countDocuments(query);

        res.status(200).json({
            products,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum)
        });
    } catch (error) {
        res.status(500).json({ message: "Products lane mein error aayi", error });
    }
});

// 2. POST API: Database mein naya product dalne ke liye (Admin only)
router.post('/add', protect, admin, async (req, res) => {
    try {
        const newProduct = new Product(req.body); // Frontend/Postman se aane wala data lo
        await newProduct.save(); // Database mein save karo
        res.status(201).json({ message: "Product successfully add ho gaya! 🎉", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Product add karne mein error aayi", error });
    }
});

// 3. POST API: Ek saath bahut saare products dalne ke liye (Admin only)
router.post('/seed', protect, admin, async (req, res) => {
    try {
        // insertMany() function array ko ek saath database me dalta hai
        const products = await Product.insertMany(req.body); 
        res.status(201).json({ message: "Dukaan full ho gayi! Saare products add ho gaye! 🛒🎉", count: products.length });
    } catch (error) {
        res.status(500).json({ message: "Products add karne mein error aayi", error });
    }
});

// 4. GET API: Kisi ek specific product ko uski ID se fetch karne ke liye
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); 
        if (!product) {
            return res.status(404).json({ message: "Product nahi mila! 😢" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "ID fetch karne mein error aayi", error });
    }
});

// 5. DELETE API: Saare products saaf karne ke liye (Admin only)
router.delete('/clear', protect, admin, async (req, res) => {
    try {
        await Product.deleteMany({});
        res.status(200).json({ message: "Database ekdum saaf ho gaya! 🧹✨" });
    } catch (error) {
        res.status(500).json({ message: "Delete karne mein error aayi", error });
    }
});

// 6. DELETE API: Single product delete (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product delete ho gaya! 🗑️" });
    } catch (error) {
        res.status(500).json({ message: "Delete karne mein error aayi", error });
    }
});

module.exports = router;