const express = require('express');
const router = express.Router();
const { getUnverifiedVolunteers, verifyVolunteer, removeUnverifiedVolunteer, updateVolunteerDetails } = require('../controllers/volunteerController');
const authMiddleware = require('../middlewares/authToken');
const { getFoodByArea, assignFoodToVolunteer, getVolunteersByArea } = require('../controllers/getFoodController');
const { getAllBeneficiaries, removeBeneficiary }=require('../controllers/BeneficiaryController')
const { getCoordinatorProfile }=require('../controllers/coordinatorController')
// Routes for volunteers

router.get('/profile', authMiddleware, getCoordinatorProfile);

router.get('/volunteers/unverified', authMiddleware, getUnverifiedVolunteers);
router.patch('/volunteers/verify/:id', authMiddleware, verifyVolunteer);
router.delete('/volunteers/remove/:id', authMiddleware, removeUnverifiedVolunteer);
router.put('/volunteers/update/:id', authMiddleware, updateVolunteerDetails);



// GET /coordinator/coordinator-area - Fetch food items by area
router.get('/coordinator-area',authMiddleware, getFoodByArea);

// GET /coordinator/by-area - Fetch volunteers by area
router.get('/by-area',authMiddleware, getVolunteersByArea);

// POST /coordinator/assign - Assign food to volunteer
router.post('/assign', authMiddleware, assignFoodToVolunteer);




//fetch beneficiaries


router.get('/beneficiaries', authMiddleware, getAllBeneficiaries)
router.delete('/beneficiaries/remove/:id',authMiddleware,removeBeneficiary)



module.exports = router;
