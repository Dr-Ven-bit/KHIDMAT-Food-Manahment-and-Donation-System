const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addFoodSchema = new mongoose.Schema({
    nameFood: {
        type: String,
        required: true
    },
    quantityFood: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'waiting',
        // enum: ['recived', 'waiting', 'delivered']
    },
    assignedTo: {
        type: Boolean,
        default: false
    },
    isGiven: {
        type: Boolean,
        default: false
    },
    foodAddedby: {
        type: Schema.Types.ObjectId,
        ref: 'FoodProvider'
    }
});

const AddFood = mongoose.model('AddFood', addFoodSchema);

module.exports = AddFood;
