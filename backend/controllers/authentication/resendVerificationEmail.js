const { getUserModel } = require('../../utils/Utils');
const generateAndSendOTP = require('../../utils/generateAndSendOTP');

exports.resendVerificationEmail = async (req, res, next) => {
    try {
        const { email, role } = req.user; // Get decoded token data from req.user

        const User = getUserModel(role);
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.email_verified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        await generateAndSendOTP(user);

        res.status(200).json({ message: "Verification email resent successfully" });
    } catch (error) {
        next(error);
    }
};
