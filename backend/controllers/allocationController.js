const Coordinator  = require('../models/coordinator');
const  Beneficiary  = require('../models/beneficiary');
const  Volunteer  = require('../models/volunteer');
const Food  = require('../models/addFood');



// // Fetch beneficiaries for the distribution plan
// const getFilteredBeneficiaries = async (req, res) => {
//     try {
//         const coordinator = await Coordinator.findById(req.user.id)
//             .populate({
//                 path: 'totalBeneficiary',
//                 match: { isChecked: true, isUpdated: false },
//             });

//         if (!coordinator) {
//             return res.status(404).json({ message: 'Coordinator not found' });
//         }

//         res.status(200).json(coordinator.totalBeneficiary);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// };





const getFilteredBeneficiaries = async (req, res) => {
    try {
        // Step 1: Find the coordinator by their user ID
        const coordinator = await Coordinator.findById(req.user.id);
        if (!coordinator) {
            return res.status(404).json({ message: 'Coordinator not found' });
        }

        // Step 2: Find volunteers in the same area as the coordinator
        const volunteers = await Volunteer.find({ area: coordinator.area })
            .populate({
                path: 'beneficiaries',
                match: { isChecked: true, isUpdated: false,status:'pending' }, // Filter beneficiaries
            });

        // Step 3: Extract beneficiaries from each volunteer
        const filteredBeneficiaries = volunteers.reduce((acc, volunteer) => {
            const validBeneficiaries = volunteer.beneficiaries || [];
            return acc.concat(validBeneficiaries);
        }, []);
        // console.log(filteredBeneficiaries,"beneficiary");

        // Step 4: Return the filtered beneficiaries
        res.status(200).json(filteredBeneficiaries);

    } catch (error) {
        console.error('Error fetching filtered beneficiaries:', error);
        res.status(500).send('Server error');
    }
};



// const getDeliveredFoods = async (req, res) => {
//     try {
//         const deliveredFoods = await Food.find({ status: 'delivered' });
//         res.status(200).json(deliveredFoods);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// };

const getDeliveredFoods = async (req, res) => {
    try {
        // Step 1: Find the coordinator by their user ID
        const coordinator = await Coordinator.findById(req.user.id);

        if (!coordinator) {
            return res.status(404).json({ message: 'Coordinator not found' });
        }

        // Step 2: Find volunteers in the same area as the coordinator
        const volunteers = await Volunteer.find({ area: coordinator.area })
            .populate({
                path: 'addFoodToDeliver',
                match: {            
                    status: 'delivered', isGiven: false, assignedTo:true,
                    quantityFood: { $gt: 0 }
                },  // Filter for foods with status 'delivered'
            });

        // Step 3: Extract delivered foods from each volunteer
        const deliveredFoods = volunteers.reduce((acc, volunteer) => {
            const validFoods = volunteer.addFoodToDeliver || [];
            return acc.concat(validFoods);
        }, []);

        // Step 4: Return the delivered foods
        res.status(200).json(deliveredFoods);

    } catch (error) {
        console.error('Error fetching delivered foods:', error);
        res.status(500).send('Server error');
    }
};




const getAvailableVolunteers = async (req, res) => {
    try {
        
        const coordinator = await Coordinator.findById(req.user.id);
        if (!coordinator) {
            return res.status(404).json({ message: 'Coordinator not found' });
        }
        const volunteers = await Volunteer.find({ area: coordinator.area });
        res.status(200).json(volunteers);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

const allocateFood = async (req, res) => {
    try {
        const { foodId, volunteerId } = req.body;

        // Find the selected food to get its quantity
        const food = await Food.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        let foodQuantity = food.quantityFood;

        // Find available beneficiaries (who haven't been allocated yet)
        const beneficiaries = await Beneficiary.find({ isChecked: true, isUpdated: false ,status:"pending"});//error

        // Shuffle the beneficiaries array randomly
        const shuffledBeneficiaries = beneficiaries.sort(() => 0.5 - Math.random());
        console.log(shuffledBeneficiaries,"shuffledBeneficiaries");

        let selectedBeneficiaries = [];
        let totalAllocatedFood = 0;

        // Loop through the shuffled list and pick beneficiaries until we meet the food quantity
        for (let beneficiary of shuffledBeneficiaries) {
            if (totalAllocatedFood + beneficiary.allocatedFood <= foodQuantity) {
                selectedBeneficiaries.push(beneficiary);
                totalAllocatedFood += beneficiary.allocatedFood;
            }
            if (totalAllocatedFood >= foodQuantity) {
                break;
            }
        }

        // If the total allocated food is less than the available food quantity, reduce the food's quantity
        if (totalAllocatedFood < foodQuantity) {
            foodQuantity -= totalAllocatedFood;
            await Food.findByIdAndUpdate(foodId, { quantityFood: foodQuantity });
        } else {
            await Food.findByIdAndUpdate(foodId, {  quantityFood: 0, isGiven: true });
        }

        // If no beneficiaries were selected (i.e., no allocation was done), respond accordingly
        if (selectedBeneficiaries.length == 0) {
            return res.status(400).json({ message: 'No beneficiaries could be allocated with the remaining food quantity' });
        }

        // Update selected beneficiaries
        const beneficiaryUpdates = selectedBeneficiaries.map(beneficiary => {
            return Beneficiary.findByIdAndUpdate(beneficiary._id, {
                isAllocated: food.nameFood,
                status:'waiting',
            });
        });
        await Promise.all(beneficiaryUpdates);

        // Update volunteer's allocation record
        await Volunteer.findByIdAndUpdate(volunteerId, {
            $push: { allocatedBeneficiaries: { $each: selectedBeneficiaries.map(b => b._id) } }
        });

        res.status(200).json({ message: 'Allocation successful', selectedBeneficiaries });
        // console.log(selectedBeneficiaries, "selectedBeneficiaries");
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};



module.exports = {
    getFilteredBeneficiaries,
    getDeliveredFoods,
    getAvailableVolunteers,
    allocateFood,
};
