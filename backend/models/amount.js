
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const amountSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    donorPhoneNumber: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true
    },
    transferName: {
        type: String,
        required: true
    },
    screenshot: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['pending', 'received', 'not received']
    },
    sponsor: {
        type: Schema.Types.ObjectId,
        ref: 'Sponsor',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Amount = mongoose.model('Amount', amountSchema);

module.exports = Amount;
