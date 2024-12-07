const  Volunteer  = require('../models/volunteer');
const  AddFood  = require('../models/addFood');
const Beneficiary = require('../models/beneficiary');

const getfoodDeliveriesOfBeneficiaries = async (req, res) => {
    try {
        // Fetch the volunteer and populate their allocated beneficiaries
        const volunteer = await Volunteer.findById(req.user.id)
            .populate('allocatedBeneficiaries');
        
        // console.log(volunteer,"volunteer")
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        const foodDeliveriestoBeneficieried = volunteer.allocatedBeneficiaries
        // console.log(foodDeliveriestoBeneficieried,"foodDeliveriestoBeneficieried");
        
        res.status(200).json(foodDeliveriestoBeneficieried);
    } catch (error) {
        console.error('Error fetching food deliveries:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const handleFoodDeliveryBeneficiaryStatus = async (req, res) => {
    const { beneficiaryId, action } = req.body;// Changed beneficiaryId to beneficiaryId for clarity
    console.log(req.body);
    try {
        const beneficiary = await Beneficiary.findById(beneficiaryId);
        if (!beneficiary) {
            return res.status(404).json({ message: 'Beneficiary not found' });
        }

        if (action === 'accept') {
            beneficiary.status = 'received';
        } else if (action === 'reject') {
            await Volunteer.findByIdAndUpdate(req.user.id, {
                $pull: { allocatedBeneficiaries: beneficiaryId },
            });

            if (!beneficiary.isAllocated || beneficiary.isAllocated == "") {
                return res.status(400).json({ message: 'No food allocated to this beneficiary' });
            }

            const addFoodDoc = await AddFood.findOne({
                nameFood: beneficiary.isAllocated,
                // allocatedFood: { $gte: 0 } // Changed condition to find any matching food
            });

            if (!addFoodDoc) {
                res.status(404).json({ message: error.message });
            }
            if (addFoodDoc) {
                addFoodDoc.quantityFood += beneficiary.allocatedFood;
                addFoodDoc.isGiven = false;
                await addFoodDoc.save();
                console.log('AddFood document updated:', addFoodDoc);
            } else {
                console.error('No matching AddFood document found');
                // Consider creating a new AddFood document here if needed
            }

            beneficiary.isAllocated = "";
            // beneficiary.allocatedFood = 0; // Reset allocated food
            beneficiary.status = "pending";
        }

        await beneficiary.save();
        res.status(200).json({ message: 'Food delivery status updated successfully.' });
    } catch (error) {
        console.error('Error updating food delivery status:', error.message, error.stack);
        res.status(404).json({ message: error.message });
    }
};


const updateBeneficiaryDeliveryStatus = async (req, res) => {
    const { beneficiaryId, status } = req.body; // status: delivered or not delivered
    
    console.log(req.body);
    try {
        const beneficiary = await Beneficiary.findById(beneficiaryId);

        if (!beneficiary) {
            return res.status(404).json({ message: 'Food not found' });
        }

        if (status === 'delivered') {
            beneficiary.status = 'delivered';
            beneficiary.isUpdated = true;
        } else if (status === 'not delivered') {
            await Volunteer.findByIdAndUpdate(req.user.id, {
                $pull: { allocatedBeneficiaries: beneficiaryId },
            });

            if (!beneficiary.isAllocated || beneficiary.isAllocated == "") {
                return res.status(400).json({ message: 'No food allocated to this beneficiary' });
            }

            const addFoodDoc = await AddFood.findOne({
                nameFood: beneficiary.isAllocated,
                // allocatedFood: { $gte: 0 } // Changed condition to find any matching food
            });

            if (!addFoodDoc) {
                res.status(404).json({ message: error.message });
            }
            if (addFoodDoc) {
                addFoodDoc.quantityFood += beneficiary.allocatedFood;
                addFoodDoc.isGiven = false;
                await addFoodDoc.save();
                console.log('AddFood document updated:', addFoodDoc);
            } else {
                console.error('No matching AddFood document found');
                // Consider creating a new AddFood document here if needed
            }

            beneficiary.isAllocated = "";
            // beneficiary.allocatedFood = 0; // Reset allocated food
            beneficiary.status = "pending";
        }


        await beneficiary.save();
        console.log(beneficiary,"beneficiary"); 
        res.status(200).json({ message: 'Delivery status updated successfully.' });
    } catch (error) {
        console.error('Error updating delivery status:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getfoodDeliveriesOfBeneficiaries,
    handleFoodDeliveryBeneficiaryStatus,
    updateBeneficiaryDeliveryStatus
}

