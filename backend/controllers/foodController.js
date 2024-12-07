const Volunteer = require('../models/volunteer');
const AddFood = require('../models/addFood');
const FoodProvider = require('../models/foodProvider');
const Report = require('../models/distributedReport');

// Get food deliveries for a volunteer
const getFoodDeliveries = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.user.id)
            .populate({
                path: 'addFoodToDeliver',
                match: { assignedTo: true }, // Only populate foods where assignedTo is true
                populate: { path: 'foodAddedby', model: 'FoodProvider' }
            });

        res.status(200).json(volunteer.addFoodToDeliver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Accept or Reject food delivery
const handleFoodDeliveryStatus = async (req, res) => {
    const { foodId, action } = req.body; // action: accept or reject

    try {
        const food = await AddFood.findById(foodId);
        console.log(food,"food is that")
        if (action === 'accept') {
            food.status = 'received';
        } else if (action === 'reject') {
           
          
            await Volunteer.findByIdAndUpdate(req.user.id,
                { $pull: { addFoodToDeliver: foodId } });
            food.status="waiting"
            food.assignedTo = false;
            food.rejected=true;
        }
        await food.save();
        res.status(200).json({ message: 'Food delivery status updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update delivery status (delivered or not delivered)
const updateDeliveryStatus = async (req, res) => {
    const { foodId, status } = req.body; // status: delivered or not delivered

    try {
        const food = await AddFood.findById(foodId);

        if (status === 'delivered') {
            food.status = 'delivered';
        } else if (status === 'not delivered') {
            food.status = 'not delivered';
        }

        await food.save();
        res.status(200).json({ message: 'Delivery status updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Generate distribution report
// const generateReport = async (req, res) => {
//     try {
//         const volunteer = await Volunteer.findById(req.user.id)
//         .populate('addFoodToDeliver')
//         // for take food provider
//             // .populate({
//             //     path: 'addFoodToDeliver',
//             //     populate: { path: 'foodAddedby', model: 'FoodProvider' }
//             // });

//         console.log(volunteer.addFoodToDeliver,"volunteer");
//         // Calculate totals
//         const totalAccepted = awaitvolunteer.addFoodToDeliver.filter(food => food.status === 'recived').length;
//         const totalWaiting = volunteer.addFoodToDeliver.filter(food => food.status === 'waiting').length;
//         const totalDelivered = volunteer.addFoodToDeliver.filter(food => food.status === 'delivered').length;
//         const totalNotDelivered = volunteer.addFoodToDeliver.filter(food => food.status === 'not delivered').length;

//         // Create a new report
//         const report = new Report({
//             volunteer: req.user.id,
//             totalAccepted,
//             totalWaiting,
//             totalDelivered,
//             totalNotDelivered
//         });

//         // Save the report
//         await report.save();

//         // Add the report reference to the volunteer's profile
//         volunteer.reports.push(report._id);
//         await volunteer.save();

//         res.status(200).json({
//             message: 'Report generated successfully.',
//             report
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const generateReport = async (req, res) => {
    try {
        // Find the volunteer and populate the addFoodToDeliver field
        const volunteer = await Volunteer.findById(req.user.id).populate('addFoodToDeliver');

        // Check if the populated field exists and is an array
        if (!volunteer || !volunteer.addFoodToDeliver || !Array.isArray(volunteer.addFoodToDeliver)) {
            return res.status(400).json({ message: 'Food deliveries not found for the volunteer' });
        }

        // Calculate totals based on the status
        const totalAccepted = volunteer.addFoodToDeliver.filter(food => food.status === 'received').length;
        const totalWaiting = volunteer.addFoodToDeliver.filter(food => food.status === 'waiting').length;
        const totalDelivered = volunteer.addFoodToDeliver.filter(food => food.status === 'delivered').length;
        const totalNotDelivered = volunteer.addFoodToDeliver.filter(food => food.status === 'not delivered').length;

        // Create a new report object
        const report = new Report({
            volunteer: req.user.id,
            totalAccepted,
            totalWaiting,
            totalDelivered,
            totalNotDelivered
        });

        // Save the report to the database
        await report.save();
        console.log(report,"report");
        // Link the report to the volunteer's profile
        volunteer.reports.push(report._id);
        await volunteer.save();

        // Return a success response with the report
        res.status(200).json({
            message: 'Report generated successfully.',
            report
        });

    } catch (error) {
        // Catch any errors and return a 500 response with the error message
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getFoodDeliveries,
    handleFoodDeliveryStatus,
    updateDeliveryStatus,
    generateReport
};
