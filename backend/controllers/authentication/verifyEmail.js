const { getUserModel } = require('../../utils/Utils');

exports.verifyEmail = async (req, res, next) => {
    try {
        const { email, role } = req.body;
        const { otp } = req.body;
        const User = getUserModel(role);  
      

        // Find the user with the given email and valid verification token
        const user = await User.findOne({
            email: email,
            verification_token: otp,
            verification_token_time: { $gte: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Update user to verify email
        user.email_verified = true;
        user.verification_token = undefined;
        user.verification_token_time = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully", user });
    } catch (error) {
        next(error);
    }
};
