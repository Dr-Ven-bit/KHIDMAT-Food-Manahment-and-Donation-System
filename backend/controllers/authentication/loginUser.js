const { getUserModel } = require('../../utils/Utils'); // Corrected path
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res, next) => {
    try {
        console.log('Request Body:', req.body);

        const { cnic, password } = req.body;

        const roles = ['admin', 'coordinator', 'foodprovider', 'sponsor', 'volunteer'];
        let user;
        let role;

        // Iterate through roles to find the user
        for (let r of roles) {
            const UserModel = getUserModel(r);
            user = await UserModel.findOne({ cnic: Number(cnic) });

            if (user) {
                role = r; // Capture the role
                break;
            }
        }

        if (!user.isVerified) { 
           
            return res.status(404).json({ message: "User not verified" });
        }
        if (!user.email_verified) {
            return res.status(404).json({ message: "Email not verified" });
        }

        if (!user) {    
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Including id, email, and role in the token
        const payload = { id: user._id, cnic: user.cnic, role: role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

        // Returning the token and user info
        res.json({
            token,
            user,
        });
    } catch (error) {
        console.error('Login Error:', error);
        next(error);
    }
};





// exports.loginUser = async (req, res, next) => {
//     try {
//         console.log('Request Body:', req.body);

//         const { cnic, password } = req.body;

//         // Define your roles
//         const roles = ['admin', 'coordinator', 'foodprovider', 'sponsor','volunteer']; 
//         let user;
//         let role;

//         // Iterate through roles to find the user
//         for (let r of roles) {
//             const UserModel = getUserModel(r); // Get the model for the current role
//             user = await UserModel.findOne({ cnic: Number(cnic) });

//             if (user) {
//                 role = r;
//                 break; // Exit loop once the user is found
//             }
//         }

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Compare the provided password with the stored hashed password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // Generate a JWT token with the user's ID, email, and role
//         const payload = { id: user._id, email: user.email, role: role };
//         const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
//         // Return the token, user information, and cart summary
//         res.json({
//             token,
//             user,
//         });
//     } catch (error) {
//         console.error('Login Error:', error);
//         next(error); // Pass the error to the next middleware (usually an error handler)
//     }
// };
