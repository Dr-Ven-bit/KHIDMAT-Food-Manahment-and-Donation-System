const { getUserModel } = require('../../utils/Utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Verify OTP
exports.verifyOtp = async (req, res, next) => {
    const { email, role, otp, newPassword, cnic } = req.body;  // Include newPassword and cnic
    console.log(req.body)
    if (!otp) {
        return res.status(400).json({ message: 'OTP is required.' });
    }

    try {
        const User = getUserModel(role);
        let userQuery = { email, verification_token: otp, verification_token_time: { $gte: Date.now() } };
        console.log(userQuery)
        // If it's a forgot password case, add CNIC to the query
        if (cnic) {
            userQuery.cnic = cnic;
        }

        const user = await User.findOne(userQuery);

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
        // Hash the password
       
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            if (user.email_verified === true) {
                // Update user to verify email
                user.password = hashedPassword;
                user.verification_token = undefined;
                user.verification_token_time = undefined;
                await user.save();
                res.status(200).json({ message: "Passward Cheanged successfully", user });
            }
            else {
                user.password = hashedPassword;
                user.email_verified = true;
                user.verification_token = undefined;
                user.verification_token_time = undefined;
                await user.save();
                res.status(200).json({ message: "Passward Cheanged successfully and email also verified successfully", user });
            }
        }
        else {
            // Update user to verify email
            user.email_verified = true;
            user.verification_token = undefined;
            user.verification_token_time = undefined;
            await user.save();
            res.status(200).json({ message: "Email verified successfully", user });
        }

    } catch (error) {
        next(error);
    }
};



// const {getUserModel} = require('../../utils/Utils');
// const jwt = require('jsonwebtoken');
 

// // Verify OTP
// exports.verifyOtp = async (req, res, next) => {
//     const { email, role } = req.body;
//     console.log(email, "email")
//     console.log(role, "role")
//     const { otp } = req.body;
//     console.log(otp,"otp")

//     if (!otp) {
//         return res.status(400).json({ message: 'OTP is required.' });
//     }

//     try {
//         const User = getUserModel(role);
//         const user = await User.findOne({ email, reset_password_token: otp, reset_password_token_time: { $gt: new Date() } });
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid or expired OTP.' });
//         }

//         // Generate JWT for password reset
//         const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '115m' });
//         res.json({ message: 'OTP verified.', token });
//     } catch (error) {
//         next(error);
//     }
// };