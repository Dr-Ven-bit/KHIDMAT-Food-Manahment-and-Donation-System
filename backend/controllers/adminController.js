const bcrypt = require('bcrypt');

const Admin = require('../models/admin');
const Coordinator = require('../models/coordinator'); // Assuming the model is named Coordinator
// const generate8DigitUUID = require('../utils/'); // Your UUID generation utility
const FoodProvider = require('../models/foodProvider');



// Fetch admin profile based on the token
const getAdminProfile = async (req, res) => {
    try {

        // Fetch admin details from the database
        const admin = await Admin.findById(req.user.id)
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json({
            admin
        });
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const getCoordinators = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).populate('addCoordinator');
        const coordinators = admin.addCoordinator;

        res.json(coordinators);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

const removeCoordinator = async (req, res) => {
    try {
        const coordinatorId = req.params.id;
        console.log(coordinatorId , "coordinator id"); 

        await Admin.findByIdAndUpdate(req.user._id, { $pull: { addCoordinators: coordinatorId } });
        await Coordinator.findByIdAndDelete(coordinatorId);

        res.send('Coordinator removed successfully');
    } catch (error) {
        console.error('Error removing coordinator:', error);
        res.status(500).send('Server error');
    }
};

//     const { cnic, password, name, fatherName, centerName, email, phoneNumber, address, gender } = req.body;

//     try {
//         let coordinator = await Coordinator.findOne({ $or: [{ cnic }, { phoneNumber }] });
//         if (coordinator) {
//             const message = coordinator.cnic === cnic ? 'CNIC already exists' : 'Phone number already exists';
//             return res.status(400).json({ msg: message });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         // const uuid = generate8DigitUUID(); // Generate an 8-digit UUID
//         coordinator = new Coordinator({
//             cnic,
//             password: hashedPassword,
//             name,
//             fatherName,
//             centerName,
//             email,
//             phoneNumber,
//             address,
//             gender,
//             addedAdmin: req.user._id,
//             // uuid, // Add UUID to coordinator
//         });

//         await coordinator.save();

//         const admin = await Admin.findById(req.user._id);
//         admin.addCoordinator.push(coordinator._id);
//         await admin.save();

//         res.json(coordinator);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Server error');
//     }
// };

const addCoordinator = async (req, res) => {
    const { cnic, password, name, fatherName, area, email, phoneNumber, address, gender } = req.body;

    try {
        let coordinator = await Coordinator.findOne({ $or: [{ cnic }, { phoneNumber }] });
        if (coordinator) {
            const message = coordinator.cnic === cnic ? 'CNIC already exists' : 'Phone number already exists';
            return res.status(400).json({ msg: message });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        coordinator = new Coordinator({
            cnic,
            password: hashedPassword,
            name,
            fatherName,
            area,
            email,
            phoneNumber,
            address,
            gender,
            addedAdmin: req.user.id,
        });

        await coordinator.save();

        // Retrieve the admin and check if it exists
        const admin = await Admin.findById(req.user.id);
        // console.log(req.user.id , "admin id");
        if (!admin) {
            return res.status(404).json({ msg: 'Admin not found' });
        }

        admin.addCoordinator.push(coordinator._id);
        await admin.save();

        res.json(coordinator);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};


//for food provider


    // Get unverified providers
    const getVerifiedProviders = async (req, res) => {
        try {
            const providers = await FoodProvider.find();
            // console.log(providers , "providers");
            res.json(providers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    // Verify food provider
    const verifyFoodProvider = async (req, res) => {
        try {
            const providerId = req.params.id;
            const updatedProvider = await FoodProvider.findByIdAndUpdate(providerId, { isVerified: true }, { new: true });
            if (!updatedProvider) {
                return res.status(404).json({ message: 'Provider not found' });
            }
            res.status(200).json(updatedProvider);
        } catch (error) {
            res.status(500).json({ message: 'Error verifying provider', error });
        }
    };

// /


// Remove food provider
const removeUnverifiedFoodProvider = async (req, res) => {
    try {
        const provider = await FoodProvider.findByIdAndDelete(req.params.id);
        if (!provider) return res.status(404).json({ message: 'Provider not found' });

        res.status(200).json({ message: 'Provider removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing provider', error });
    }
};

// Update food provider details after verification
 const updateProviderDetails = async (req, res) => {
    try {
        const provider = await FoodProvider.findById(req.params.id);
        if (!provider) return res.status(404).json({ message: 'Provider not found' });

        Object.assign(provider, req.body);
        await provider.save();
        res.status(200).json({ message: 'Provider updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating provider', error });
    }
};







// const Admin = require('../models/admin'); // Assuming you have an Admin schema
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// Add Admin Function
const addAdmin = async (req, res) => {
    const {name, email, password, role } = req.body; // Assuming these fields are being sent in the request body

    try {
        // Check if the admin already exists
        let existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new Admin object
        const newAdmin = new Admin({
            name,
            email,
            cnic:"3520193333545",
            password: hashedPassword,  // Save the hashed password
            role: role || 'admin', // Set default role as 'admin' if not provided
        });

        // Save admin to database
        await newAdmin.save();

        // Send success response
        res.status(201).json({ message: 'Admin added successfully', admin: newAdmin });

    } catch (error) {
        res.status(500).json({ message: 'Error adding admin', error });
    }
};

module.exports = {
    getAdminProfile,
    getCoordinators,
    addCoordinator,
    removeCoordinator,

    getVerifiedProviders,
    verifyFoodProvider,
    removeUnverifiedFoodProvider,
    updateProviderDetails,
    addAdmin,
};

