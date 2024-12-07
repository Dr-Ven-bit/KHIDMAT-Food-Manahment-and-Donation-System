// util/emailService.js
require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // your email address
    pass: process.env.APP_PASSWORD, // your app password
  },
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
  try {
    let info = await transporter.sendMail({
    //   from: `"Student Facility System" <${process.env.EMAIL}>`, // sender address
      from:'"Khidmat Web Application" <no-reply@khidmat.com>',
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
