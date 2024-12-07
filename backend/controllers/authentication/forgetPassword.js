const { getUserModel, generateVerificationToken, maxTokenTime } = require('../../utils/Utils');
const sendEmail = require('../../utils/emailService');
const jwt = require('jsonwebtoken');

// Send OTP
exports.sendOtp = async (req, res, next) => {

    const { cnic, email } = req.body;

        if (!cnic || !email) {
            return res.status(400).json({ message: 'CNIC and email are required.' });
        }

        try {
            const roles = ['admin', 'coordinator', 'foodprovider', 'sponsor', 'volunteer'];
            let user;
            let role;

            // Iterate through roles to find the user
            for (let r of roles) {
                const UserModel = getUserModel(r);
                user = await UserModel.findOne({ cnic: Number(cnic), email });
                if (user) {
                    role = r; // Capture the role
                    break;
                }
            }

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Generate OTP and send it to the user's email
            const otp = generateVerificationToken();
            user.verification_token_time = maxTokenTime();
            user.verification_token = otp;
            await user.save();

            const token = jwt.sign({ email, role, cnic }, process.env.JWT_SECRET, { expiresIn: '15m' });

            const emailSubject = 'Password Reset OTP';
            const emailText = `Your OTP for password reset is: ${otp}`;
            await sendEmail(user.email, emailSubject, emailText);

            res.json({ message: 'OTP sent to your email.', token, role });  // Send role as well
        } catch (error) {
            next(error);
        }
    };

//     const { email, role,cnic } = req.body;

//     if (!email || !role) {
//         return res.status(400).json({ message: 'Email and role are required.' });
//     }

//     try {
//         const User = getUserModel(role);
//         const user = await User.findOne({ email,cnic });
//         if (!user) {
//             return res.status(400).json({ message: 'Email not found.' });
//         }

//         const otp = generateVerificationToken();
//         // user.reset_password_token = otp;
//         user.reset_password_token_time = maxTokenTime();
//         user.verification_token = otp;
//         user.verification_token_time = maxTokenTime();
//         await user.save();

//         const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '15m' });

//         const emailSubject = 'Password Reset OTP';
//         const emailText = `Your OTP for password reset is: ${otp}`;

//         await sendEmail(user.email, emailSubject, emailText);
//         res.json({ message: 'OTP sent to your email.', token });
//     } catch (error) {
//         next(error);
//     }
// };


