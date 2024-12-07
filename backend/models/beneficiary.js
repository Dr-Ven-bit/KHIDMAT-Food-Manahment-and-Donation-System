const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beneficiarySchema = new Schema({
    name: { type: String, required: true },
    fatherName: { type: String },
    cnic: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    address: { type: String },
    
    createdat: { type: Date, default: Date.now },
    area: { type: String },
    isChecked: { type: Boolean, default: false },//for edit beneficiary
    familySize: { type: Number },
    familyIncome: { type: Number },
    isUpdated: { type: Boolean, default: false },//for allocation beneficiary and now we can not use it
    isAllocated: {type:String,default:""},
    status: {
        type: String, default: 'pending',
        // enum: ['receive', 'pending', 'missed']
    },
   
    allocatedFood: { type: Number, default: 0 }, // Add this field

    Volunteeraddedby: { type: Schema.Types.ObjectId, ref: 'Volunteer' },

});

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
