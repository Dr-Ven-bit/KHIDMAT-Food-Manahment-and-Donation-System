// Get unverified volunteers
const Volunteer = require('../models/volunteer');
const Coordinator = require('../models/coordinator')
const Beneficiary =require('../models/beneficiary');
const beneficiary = require('../models/beneficiary');

// const getUnverifiedVolunteers = async (req, res) => {
//     try {
//         const volunteers = await Volunteer.find();
//         console.log("volunteers",volunteers);
//         res.json(volunteers);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


const getVolunteerProfile = async (req, res) => {
    try {

        // Fetch Coordinator details from the database
        const volunteer = await Volunteer.findById(req.user.id)
        console.log(volunteer);
        if (!volunteer) {
            return res.status(404).json({ message: 'Coordinator not found' });
        }

        res.json({
            volunteer
        });
    } catch (error) {
        console.error('Error fetching Coordinator profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const getUnverifiedVolunteers = async (req, res) => {
    try {
        // Get the coordinator's area based on the logged-in coordinator's ID
        const coordinator = await Coordinator.findById(req.user.id);

        if (!coordinator) {
            return res.status(404).json({ message: 'Coordinator not found' });
        }

        // Find volunteers whose area matches the coordinator's area
        const volunteers = await Volunteer.find({ area: coordinator.area });

        console.log("volunteers", volunteers);
        res.json(volunteers);
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        res.status(500).json({ message: error.message });
    }
};


// Verify volunteer
const verifyVolunteer = async (req, res) => {
    try {
        const volunteerId = req.params.id;
        const updatedVolunteer = await Volunteer.findByIdAndUpdate(volunteerId, { isVerified: true }, { new: true });
        if (!updatedVolunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }
        res.status(200).json(updatedVolunteer);
    } catch (error) {
        res.status(500).json({ message: 'Error verifying volunteer', error });
    }
};

// Remove volunteer
const removeUnverifiedVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

        res.status(200).json({ message: 'Volunteer removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing volunteer', error });
    }
};

// Update volunteer details after verification
const updateVolunteerDetails = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

        Object.assign(volunteer, req.body);
        await volunteer.save();
        res.status(200).json({ message: 'Volunteer updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating volunteer', error });
    }
};



const deletedBeneficiaryFromVolunteer = async (req, res) => {
    try {
        const beneficiaryId = req.params.id;
        console.log(beneficiaryId,'beneficiary');

        // Find the beneficiary by ID and delete
        const deletedBeneficiary = await Beneficiary.findByIdAndDelete(beneficiaryId);

        if (!deletedBeneficiary) {
            return res.status(404).json({ message: 'Beneficiary not found' });
        }

        res.status(200).json({ message: 'Beneficiary deleted successfully', deletedBeneficiary });
    } catch (error) {
        console.error('Error deleting beneficiary:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    deletedBeneficiaryFromVolunteer,
    getVolunteerProfile,
    getUnverifiedVolunteers,
    verifyVolunteer,
    removeUnverifiedVolunteer,
    updateVolunteerDetails
};

