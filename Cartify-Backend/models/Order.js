const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Cart Items ka format
    orderItems: [
        {
            title: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, default: 1 }
        }
    ],
    // Address ka format
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pinCode: { type: String, required: true }
    },
    // Razorpay Payment Details
    paymentInfo: {
        id: { type: String },
        status: { type: String, default: 'Paid' }
    },
    // Final Amount aur Status
    totalPrice: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        default: 'Processing' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);