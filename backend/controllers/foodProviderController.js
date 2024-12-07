const FoodProvider = require('../models/foodProvider');
const AddFood = require('../models/addFood');

// Add Food Controller
// exports.addFood = async (req, res) => {
//     try {
//         const { foodEntries } = req.body;
//         console.log(foodEntries);
//         const foodProvider = await FoodProvider.findOne({ _id: req.user.id });

//         if (!foodProvider) {
//             return res.status(400).json({ message: 'Food provider not found' });
//         }

//         foodEntries.forEach(food => {
//             foodProvider.AddFoodList.push({
//                 nameFood: food.foodName,
//                 quantityFood: food.quantity,
//                 status: 'waiting'
//             });
//         });

//         await foodProvider.save();
//         res.status(201).json({ message: 'Food added successfully', success: true });
//     } catch (error) {
//         console.error('Error adding food:', error);
//         res.status(500).json({ message: 'Error adding food', error: error.message });
//     }
// };
//add food proveder


exports.getFoodProviderProfile = async (req, res) => {
    try {

        // Fetch Coordinator details from the database
        const foodprovider = await FoodProvider.findById(req.user.id)
        console.log(foodprovider);
        if (!foodprovider) {
            return res.status(404).json({ message: 'Coordinator not found' });
        }

        res.json({
            foodprovider
        });
    } catch (error) {
        console.error('Error fetching Coordinator profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addFood = async (req, res) => {
    try {
        const { foodEntries } = req.body;
        console.log(foodEntries);
        const foodProvider = await FoodProvider.findOne({ _id: req.user.id });

        if (!foodProvider) {
            return res.status(400).json({ message: 'Food provider not found' });
        }

        // Create an array to hold the new food items
        const foodItems = foodEntries.map(food => {
            return new AddFood({
                nameFood: food.foodName,
                quantityFood: food.quantity,
                status: 'waiting',
                foodAddedby: foodProvider._id // Reference to the food provider
            });
        });

        // Save food items in the database
        await AddFood.insertMany(foodItems);

        // Push the newly created food items' IDs to the FoodProvider's AddFoodList
        foodProvider.AddFoodList.push(...foodItems.map(item => item._id));

        await foodProvider.save();
        res.status(201).json({ message: 'Food added successfully', success: true });
    } catch (error) {
        console.error('Error adding food:', error);
        res.status(500).json({ message: 'Error adding food', error: error.message });
    }
};


// Get Food History Controller
exports.getFoodHistory = async (req, res) => {
    try {
        const foodProvider = await FoodProvider.findById(req.user.id).populate({
            path: 'AddFoodList',
            model: 'AddFood',
            select: 'nameFood quantityFood status'
        });
        if (!foodProvider) {
            return res.status(400).json({ message: 'Food provider not found' });
        }

        res.status(200).json({ foodEntries: foodProvider.AddFoodList });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching food history', error });
    }
};
