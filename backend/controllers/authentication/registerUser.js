const { getUserModel, validateAdditionalFields, generateVerificationToken, maxTokenTime, isEmailUnique } = require('../../utils/Utils');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../utils/emailService');
const bcrypt = require('bcrypt');

exports.signUpUser = async (req, res, next) => {
  try {
    const { name, cnic, phoneNumber, email, gender, role, password, confirmPassword, ...additionalFields } = req.body;
    console.log(additionalFields);

    // Password confirmation check
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email is unique
    const isUnique = await isEmailUnique(email);
    if (!isUnique) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP for email verification
    const otp = generateVerificationToken();
    console.log(otp);
    // Get the user model based on the role
    const User = getUserModel(role);
    // Validate additional fields based on the role
    const validatedAdditionalFields = validateAdditionalFields(role, additionalFields);

    // Prepare user data with validated fields
    console.log(validatedAdditionalFields);
    const userData = {
      name,
      cnic,
      phoneNumber,
      email,
      gender,
      password: hashedPassword,
      verification_token: otp,
      verification_token_time: maxTokenTime(),
      ...validatedAdditionalFields
    };

    const user = new User(userData);
    await user.save();

    // Send verification email
    const emailSubject = 'Email Verification';
    const emailText = `Your OTP for email verification is: ${otp}`;
    await sendEmail(email, emailSubject, emailText);

    // Create and send JWT token
    const payload = { id: user._id, email: user.email, role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });

    res.status(201).json({ message: `${role} registered successfully. Please check your email for the OTP.`, token });
  } catch (error) {
    next(error);
  }
};
