const { getUserModel } = require('../../utils/Utils');
const bcrypt = require('bcrypt');

// Reset Password
exports.resetPassword = async (req, res, next) => {
    const { id, role } = req.user;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'New password and confirm password are required.' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    try {
        const User = getUserModel(role);
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'Invalid token.' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.reset_password_token = undefined;
        user.reset_password_token_time = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully. Please log in with your new password.' });
    } catch (error) {
        next(error);
    }
};
