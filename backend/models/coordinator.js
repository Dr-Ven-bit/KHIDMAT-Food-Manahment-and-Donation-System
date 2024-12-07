const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the Coordinator schema
const coordinatorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    fatherName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true, // Ensure phone numbers are unique
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'], // Optional: Specify allowed values
    },
    cnic: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    email_verified: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: true,
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        // enum: ['coordinator', 'superadmin'], // Define allowed roles
        default: 'coordinator',
    },
    addedAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    addedFoodProvider: {
        type: Schema.Types.ObjectId,
        ref: 'FoodProvider'
    }
}, { timestamps: true });

// Create the Coordinator model
const Coordinator = mongoose.model('Coordinator', coordinatorSchema);

// Export the model
module.exports = Coordinator;
