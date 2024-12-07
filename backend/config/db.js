const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection URI from your environment variables
const mongoURI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            tlsAllowInvalidCertificates: true,  // Allow invalid certificates for SSL
            tlsAllowInvalidHostnames: true  // Allow invalid hostnames for SSL
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
