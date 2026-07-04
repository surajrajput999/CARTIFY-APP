const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// 1. GET API: Database se saare products lane ke liye
router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); // Database se saare products dhundho
        res.status(200).json(products); // Frontend ko bhej do
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

// 5. DELETE API: Ek click mein saara data saaf karne ke liye (Admin only)
router.delete('/clear', protect, admin, async (req, res) => {
    try {
        await Product.deleteMany({}); // Yeh command database poora khali kar deti hai
        res.status(200).json({ message: "Database ekdum saaf ho gaya! 🧹✨" });
    } catch (error) {
        res.status(500).json({ message: "Delete karne mein error aayi", error });
    }
});

module.exports = router;