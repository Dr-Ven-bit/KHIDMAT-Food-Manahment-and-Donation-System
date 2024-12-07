const express = require('express');
const router = express.Router();
const { addFood, getFoodHistory, getFoodProviderProfile } = require('../controllers/foodProviderController');
const verifyJWT = require('../middlewares/authToken');
// const upload = require('../middleware/upload'); // Assuming you have file upload middleware

router.get('/profile', verifyJWT, getFoodProviderProfile);


// Add Food
// router.post('/add-food', verifyJWT, upload.single('screenshot'), addFood);
router.post('/add-food', verifyJWT, addFood);

// Get Food History
router.get('/food-history', verifyJWT, getFoodHistory);

module.exports = router;
