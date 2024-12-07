const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sponsorSchema = new mongoose.Schema({
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
    gender: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        // enum: ['sponsor', 'superadmin'],
        default: 'sponsor',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: { type: Boolean, required: true, default: true },

    email_verified: { type: Boolean, required: true, default: false },
    verification_token: { type: String, required: false },
    verification_token_time: { type: Date, required: false },
   
    addAmount: [{
        type: Schema.Types.ObjectId,
        ref: 'Amount'
    }]
}, { timestamps: true });

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

module.exports = Sponsor;
