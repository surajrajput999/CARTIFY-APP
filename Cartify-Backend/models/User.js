const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        // Ab password required nahi hai kyunki user sirf OTP se bhi login kar sakta hai!
        required: false 
    },
    isAdmin: { 
        type: Boolean, 
        default: false 
    },
    // 👇 NAYE OTP FIELDS
    otp: {
        type: String,
        default: null
    },
    otpExpire: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);