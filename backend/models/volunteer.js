const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const volunteerSchema = new mongoose.Schema({
    name: {
        type: String,//
        required: true,
    },
    fatherName: {
        type: String,//
        required: true,
    },
    phoneNumber: {     //
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,//
        unique: true,
    },
    gender: {
        type: String,
        required: true,
    },
    cnic: {
        type: String,
        required: true,//
        unique: true,
    },
    password: {
        type: String,
        required: true,//
    },
    area: {
        type: String,//
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        // enum: ['volunteer', 'superadmin'],
        default: 'volunteer',
    },
    addFoodToDeliver: [{
        type: Schema.Types.ObjectId,
        ref: 'AddFood'
    }],
    beneficiaries: [{ type: Schema.Types.ObjectId, ref: 'Beneficiary' }],
    
    reports: [{ type: Schema.Types.ObjectId, ref: 'Report' }],
    allocatedBeneficiaries: [{ type: Schema.Types.ObjectId, ref: 'Beneficiary' }],
    
    
    email_verified: { type: Boolean, required: true, default: false },
    verification_token: { type: String, required: false },
    verification_token_time: { type: Date, required: false },
  
}, { timestamps: true });

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;
