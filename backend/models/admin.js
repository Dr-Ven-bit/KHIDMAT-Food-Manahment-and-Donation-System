const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    cnic: {
        type: Number,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        default: 'admin',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        require:true
    },
    addCoordinator: [{
        type: Schema.Types.ObjectId,
        ref: 'Coordinator'
    }],
    email_verified: { type: Boolean, required: true, default: false },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
