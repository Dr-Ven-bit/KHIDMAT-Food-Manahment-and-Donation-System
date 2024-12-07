const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new mongoose.Schema({
    volunteer: {
        type: Schema.Types.ObjectId,
        ref: 'Volunteer',
        required: true
    },
    totalAccepted: {
        type: Number,
        default: 0
    },
    totalWaiting: {
        type: Number,  
        default: 0
    },
    totalDelivered: {
        type: Number,
        default: 0
    },
    totalNotDelivered: {
        type: Number,
        default: 0
    },
    reportDate: {
        type: Date,
        default: Date.now
    }
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
