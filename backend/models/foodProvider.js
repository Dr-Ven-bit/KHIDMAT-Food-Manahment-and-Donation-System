const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const foodProviderSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true,
    },
    
    cnic: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    restaurantAddress: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    restorantName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
            type: String,           
        default: 'foodprovider',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    AddFoodList: [{
        type: Schema.Types.ObjectId,
        ref: 'AddFood'
    }],
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },

    verifyStatus: {
        type: String, required: true,
        default: 'not verified',
        enum: ['not verified', 'verified', 'rejected']
    },

    email_verified: { type: Boolean, required: true, default: false },
    verification_token: { type: String, required: false },
    verification_token_time: { type: Date, required: false },
    reset_password_token: { type: String, required: false },
    reset_password_token_time: { type: Date, required: false },
    
}, { timestamps: true });

const FoodProvider = mongoose.model('FoodProvider', foodProviderSchema);

module.exports = FoodProvider;
