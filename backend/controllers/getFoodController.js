// controllers/foodController.js

const FoodProvider = require('../models/foodProvider');
const AddFood = require('../models/addFood');
const Volunteer = require('../models/volunteer');
const Coordinator = require('../models/coordinator');

// Fetch all food from FoodProviders in coordinator's area
exports.getFoodByArea = async (req, res) => {
    try {
        // Find the coordinator by their ID
        const coordinator = await Coordinator.findById(req.user.id);
        if (!coordinator) {
            return res.status(404).json({ message: 'Coordinator not found' });
        }

        const area = coordinator.area;
        console.log(area, "Coordinator's area");

        // Find all food providers in the coordinator's area
        const foodProviders = await FoodProvider.find({ area })
            .populate({
                path: 'AddFoodList',
                model: 'AddFood'
            });

        res.status(200).json({
            message: 'Food fetched successfully',
            data: foodProviders,
        });
    } catch (error) {
        console.error('Error fetching food:', error);
        res.status(500).json({ message: 'Error fetching food', error: error.message });
    }
};

// Fetch all volunteers in coordinator's area
exports.getVolunteersByArea = async (req, res) => {
    try {
        const coordinator = await Coordinator.findById(req.user.id);
        console.log(coordinator, "coordinator");
        if (!coordinator) {
            return res.status(404).json({ message: 'Coordinator not found' });
        }

        const area = coordinator.area;

        const volunteers = await Volunteer.find({ area, isVerified: true })
            
            .select('name addFoodToDeliver');

        res.status(200).json({
            message: 'Volunteers fetched successfully',
            data: volunteers,
        });
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        res.status(500).json({ message: 'Error fetching volunteers', error: error.message });
    }
};


// Assign a food item to a volunteer
exports.assignFoodToVolunteer = async (req, res) => {
    try {
        const { foodId, volunteerId } = req.body;
        console.log(foodId, volunteerId, "foodId, volunteerId");

        if (!foodId || !volunteerId) {
            return res.status(400).json({ message: 'foodId and volunteerId are required' });
        }

        // Check if the food item has already been assigned by looking at `assignedTo` field
        const foodItem = await AddFood.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        if (foodItem.assignedTo) {
            return res.status(400).json({ message: 'This food item is already assigned to a volunteer' });
        }

        // Find the volunteer
        const volunteer = await Volunteer.findById(volunteerId);
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        // Add the foodId to the volunteer's `addFoodToDeliver` array
        volunteer.addFoodToDeliver.push(foodId);
        await volunteer.save();

        // Mark the food as assigned in the AddFood schema
        foodItem.assignedTo = true;
        await foodItem.save();

        res.status(200).json({
            message: 'Food assigned successfully',
            data: volunteer,
        });
    } catch (error) {
        console.error('Error assigning food:', error);
        res.status(500).json({ message: 'Error assigning food', error: error.message });
    }
};