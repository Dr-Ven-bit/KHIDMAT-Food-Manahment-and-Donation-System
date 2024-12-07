const Beneficiary = require('../models/beneficiary');
const Volunteer = require('../models/volunteer');
const Coordinator=require('../models/coordinator')
// const bcrypt = require('bcrypt');

exports.addBeneficiary = async (req, res) => {
    const {
        name, fatherName, cnic, phoneNumber, address,
        isChecked, familySize, status, isUpdated, isAllocated,familyIncome
    } = req.body;

    console.log("Request Body: ", req.body);

    // Validate required fields (excluding isUpdated, isAllocated, and allocatedFood for now)
    if (!name || !fatherName || !cnic || !phoneNumber || !address || !familySize) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Calculate allocatedFood based on family size
    let allocatedFood;
    if (familySize == 1 || familySize == 2) {
        allocatedFood = 1;
    } else if (familySize == 3 || familySize == 4) {
        allocatedFood = 2;
    } else if (familySize == 5 || familySize == 6) {
        allocatedFood = 3;
    } else if (familySize == 7 || familySize == 8) {
        allocatedFood = 4;
    } else if (familySize >= 9) {
        allocatedFood = 5;
    }

    if (familyIncome > 20000) {
        return res.status(400).json({ msg: 'family income is greater then 2000 so it is ineligble' });
    }

    try {
        // Check if the beneficiary with the given CNIC already exists
        let beneficiary = await Beneficiary.findOne({ cnic });
        if (beneficiary) {
            return res.status(400).json({ msg: 'Beneficiary already exists' });
        }
        const volunteer = await Volunteer.findById(req.user.id);
        

        // Create new beneficiary with the allocated food value
        beneficiary = new Beneficiary({
            name,
            fatherName,
            cnic,
            phoneNumber,
            address,
            status,
            familyIncome,
            area:volunteer.area,
            isChecked,
            familySize,
            Volunteeraddedby: req.user.id,
            isUpdated,
            isAllocated,
            allocatedFood: allocatedFood,  // Include the calculated allocatedFood
        });

        // Save the new beneficiary
        await beneficiary.save();

        // Update the volunteer's beneficiaries list
       

        if (!volunteer) {
            return res.status(400).json({ message: 'Volunteer not found' });
        }
        volunteer.beneficiaries.push(beneficiary._id);
        await volunteer.save();

        // Return the newly created beneficiary
        res.status(201).json(beneficiary);
    } catch (error) {
        console.error("Error creating beneficiary: ", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};




// Volunteer Controller
exports.getEditableBeneficiaries = async (req, res) => {
    try {
        const beneficiaries = await Beneficiary.find({ addedByVolunteer: req.user._id, isChecked: false });
        console.log(beneficiaries);
        res.status(200).json(beneficiaries);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.updateBeneficiary = async (req, res) => {
    try {
        const beneficiary = await Beneficiary.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!beneficiary) {
            return res.status(404).json({ message: 'Beneficiary not found' });
        }
        res.status(200).json(beneficiary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




exports.getAllBeneficiaries = async (req, res) => {
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
                // check:'isUpdated=true'
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



// Delete a beneficiary
exports.removeBeneficiary= async (req, res) => {
    try {
        const beneficiary = await Beneficiary.findByIdAndDelete(req.params.id);
        if (!beneficiary) return res.status(404).json({ message: 'Beneficiary not found' });
        res.status(200).json({ message: 'Beneficiary removed successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error removing beneficiary', error
        });
    }
};

