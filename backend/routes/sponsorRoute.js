// routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const { submitDonation, getDonationHistory, getSponsorProfile } = require('../controllers/sponsorController');
const upload = require('../middlewares/multer'); // For handling file uploads
const verifyJWT = require('../middlewares/authToken');


router.get('/profile', verifyJWT, getSponsorProfile);

// Route to submit a donation
router.post('/donate', upload.single('screenshot'), verifyJWT,submitDonation);

// Route to get donation history
router.get('/donation-history', verifyJWT, getDonationHistory);

module.exports = router;
