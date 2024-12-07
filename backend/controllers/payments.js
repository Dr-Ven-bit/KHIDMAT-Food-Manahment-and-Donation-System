// controllers/paymentController.js

const Amount = require('../models/amount');

// // Fetch all payment details, including status and screenshot
// exports.getPayments = async (req, res) => {
//     try {
//         const payments = await Amount.find().populate('sponsor', 'name phoneNumber'); // Populating sponsor name and phoneNumber
//         res.status(200).json(payments);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching payment details' });
//     }
// };

// Fetch all payment details, including status and screenshot
// Fetch all payment details, including status and screenshot
exports.getPayments = async (req, res) => {
    try {
        const payments = await Amount.find().populate('sponsor', 'name phoneNumber'); // Populating sponsor name and phoneNumber

        // Construct the full URL for the screenshot and include the filename
        const paymentsWithDetails = payments.map(payment => ({
            ...payment.toObject(),
            screenshotUrl: `${req.protocol}://${req.get('host')}/uploads/${payment.screenshot}`, // Construct full URL
            filename: payment.screenshot // Use the filename stored in the database
        }));

        res.status(200).json(paymentsWithDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment details' });
    }
};


// Update payment status (received or not received)
exports.updatePaymentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Status can be 'received' or 'not received'

    try {
        const updatedPayment = await Amount.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment status updated successfully', updatedPayment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment status' });
    }
};
