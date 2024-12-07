// controllers/donationController.js
const Amount = require('../models/amount');
const Sponsor = require('../models/sponsor');


exports.getSponsorProfile = async (req, res) => {
    try {

        // Fetch Coordinator details from the database
        const sponsor = await Sponsor.findById(req.user.id)
        console.log(sponsor);
        if (!sponsor) {
            return res.status(404).json({ message: 'Coordinator not found' });
        }

        res.json({
            sponsor
        });
    } catch (error) {
        console.error('Error fetching Coordinator profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.submitDonation = async (req, res) => {
    try {
        const { amount, donorPhoneNumber, accountType, transferName } = req.body;
        const screenshot = req.file.filename;
        const { cnic } = req.user;
        
        const sponsor = await Sponsor.findOne({cnic});   
        if (!sponsor) {
            return res.status(400).json({ message: 'Sponsor not found' });
        }

        const newDonation = new Amount({
            amount,
            donorName:sponsor.name,
            accountType,
            donorPhoneNumber,
            transferName,
            screenshot,
            sponsor: sponsor.id,
        });

        await newDonation.save();

        sponsor.addAmount.push(newDonation.id);
        await sponsor.save();

        res.status(201).json({ message: 'Donation submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting donation', error });
    }
};

// controllers/donationController.js
// exports.getDonationHistory = async (req, res) => {
//     try {
//         // Find the sponsor based on the authenticated user's ID
//         const sponsor = await Sponsor.findById(req.user.id).populate({
//             path: 'addAmount',
//             model: 'Amount', // Ensure Amount is the correct model reference
//         });
//         console.log(sponsor,'sponsor');

//         if (!sponsor) {
//             return res.status(404).json({ message: 'Sponsor not found' });
//         }

//         // Return the populated donation history
//         const donationHistory = sponsor.addAmount;
//         res.json(donationHistory);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching donation history', error });
//     }
// };


// controllers/donationController.js
exports.getDonationHistory = async (req, res) => {
    try {
        console.log(req.user.id);
        // Find amounts associated with the logged-in sponsor
        const donationHistory = await Amount.find({ sponsor: req.user.id })
            .populate('sponsor', 'name') // Populate sponsor details (if needed)
            .sort({ createdAt: -1 }); // Sort by the creation date
       
        if (!donationHistory || donationHistory.length === 0) {
            return res.status(404).json({ message: 'No donation history found for this sponsor' });
        }
        // console.log(donationHistory, 'don');
        res.json(donationHistory);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donation history', error });
    }
};

