const express = require('express');
const router = express.Router();
const { addBeneficiary, getEditableBeneficiaries, updateBeneficiary } = require('../controllers/BeneficiaryController');
const authMiddleware = require('../middlewares/authToken');
const { getFoodDeliveries,handleFoodDeliveryStatus,updateDeliveryStatus, generateReport } = require('../controllers/foodController');
const { getFilteredBeneficiaries, getDeliveredFoods, getAvailableVolunteers, allocateFood } = require('../controllers/allocationController');
const { getfoodDeliveriesOfBeneficiaries, handleFoodDeliveryBeneficiaryStatus, updateBeneficiaryDeliveryStatus } = require('../controllers/distributeToBeneficiaries');
const { getVolunteerProfile, deletedBeneficiaryFromVolunteer }=require('../controllers/volunteerController')
// Volunteer actions for managing beneficiaries

router.delete('/beneficiary/:id', authMiddleware, deletedBeneficiaryFromVolunteer)

router.get('/profile', authMiddleware, getVolunteerProfile);


router.post('/', authMiddleware,addBeneficiary);


router.get('/edit', authMiddleware, getEditableBeneficiaries);
router.put('/:id', authMiddleware, updateBeneficiary);

//collect food
router.get('/food-deliveries', authMiddleware,getFoodDeliveries);
router.post('/food-delivery-status', authMiddleware, handleFoodDeliveryStatus);
router.post('/delivery-status', authMiddleware, updateDeliveryStatus);
router.post('/generate-report', authMiddleware, generateReport);


//give food to beneficiary by coordinator
router.get('/filtered-beneficiaries', authMiddleware, getFilteredBeneficiaries);
router.get('/delivered-foods', authMiddleware, getDeliveredFoods);
router.get('/available-volunteers',authMiddleware, getAvailableVolunteers);
router.post('/allocate-food', authMiddleware, allocateFood);

//give food to beneficiary
router.get('/food-deliveries-of-beneficiaries', authMiddleware, getfoodDeliveriesOfBeneficiaries);
router.post('/food-delivery-beneficiary-status', authMiddleware, handleFoodDeliveryBeneficiaryStatus);
router.post('/delivery-status-to-beneficiary', authMiddleware, updateBeneficiaryDeliveryStatus);


module.exports = router;
