const express = require('express');
const { getCoordinators, addCoordinator, removeCoordinator, getVerifiedProviders, verifyFoodProvider, removeUnverifiedFoodProvider, getVerifiedProviderForEditing, updateProviderDetails, getAdminProfile } = require('../controllers/adminController');
const { getPayments, updatePaymentStatus } = require('../controllers/payments');
const { addAdmin } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authToken');

const router = express.Router();


router.get('/profile', authMiddleware, getAdminProfile);

// Routes for coordinators
router.get('/coordinators', authMiddleware, getCoordinators);
router.post('/add-coordinator', authMiddleware, addCoordinator);
router.delete('/remove-coordinator/:id', authMiddleware, removeCoordinator);

// Routes for food providers
router.get('/food-providers/unverified', authMiddleware, getVerifiedProviders);
router.patch('/food-providers/verify/:id', authMiddleware, verifyFoodProvider);
router.delete('/food-providers/remove/:id', authMiddleware, removeUnverifiedFoodProvider);
// router.get('/food-providers/verified/:id', authMiddleware, getVerifiedProviderForEditing);
router.put('/food-providers/update/:id', authMiddleware, updateProviderDetails);

// Routes for payments

router.get('/payments', getPayments);  // Fetch all payments
router.patch('/payments/:id/status', updatePaymentStatus);  // Update payment status

router.post('/add-admin',addAdmin);

module.exports = router;
