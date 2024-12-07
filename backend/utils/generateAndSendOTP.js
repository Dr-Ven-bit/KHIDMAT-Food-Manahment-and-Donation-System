const { generateVerificationToken, maxTokenTime } = require('./Utils');
const sendEmail = require('./emailService');

const generateAndSendOTP = async (user) => {
    const otp = generateVerificationToken();
    user.verification_token = otp;
    user.verification_token_time = maxTokenTime();
    
    await user.save();

    const emailSubject = 'Resend Email Verification';
    const emailText = `Your new OTP for email verification is: ${otp}`;

    await sendEmail(user.email, emailSubject, emailText);
};

module.exports = generateAndSendOTP;
