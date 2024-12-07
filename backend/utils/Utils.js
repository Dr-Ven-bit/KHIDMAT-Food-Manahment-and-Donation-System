
const Admin = require('../models/admin');
const Coordinator = require('../models/coordinator');
const FoodProvider = require('../models/foodProvider');
const Sponsor = require('../models/sponsor');
const Volunteer = require('../models/volunteer');

require('dotenv').config();



exports.getUserModel = (role) => {
    console.log(role, "role")
    switch (role) { // Ensure the role is in lowercase
        case 'admin':
            return Admin;
        case 'coordinator':
            return Coordinator;
        case 'foodprovider':
            return FoodProvider;
        case 'sponsor':
            return Sponsor;
        case 'volunteer':
            return Volunteer;
        default:
            throw new Error(`Invalid role: ${role}`);
    }
};


exports.generateVerificationToken = () => {
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    
    return parseInt(otp);
}



exports.maxTokenTime = () => { 
        const now = new Date();
        const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);
    
        // Adjusting to PST (UTC+5)
        const offsetInMillis = 5 * 60 * 60 * 1000; // PST is UTC+5
        const fiveMinutesLaterPST = new Date(fiveMinutesLater.getTime() + offsetInMillis);
    
        return fiveMinutesLaterPST;
}
    
exports.isEmailUnique = async (email) => {
    let user = await Coordinator.findOne({ email });
    if (user) return false;

    user = await FoodProvider.findOne({ email });
    if (user) return false;

    user = await Sponsor.findOne({ email });
    if (user) return false;

    user = await Volunteer.findOne({ email });
    if (user) return false;

    return true;
};

exports.validateAdditionalFields = (role, additionalFields) => {
    switch (role) {
        case 'volunteer':
            if (!additionalFields.area) {
                throw new Error('Missing required fields for volunteer');
            }
            if (!additionalFields.fatherName) {
                throw new Error('Missing required fields for volunteer');
            }
            if (!additionalFields.address) {
                throw new Error('Missing required fields for volunteer');
            }
            return {
                area: additionalFields.area,
                fatherName: additionalFields.fatherName,
                address: additionalFields.address
            };
        case 'sponsor':
            if (!additionalFields.address) {
                throw new Error('Missing required fields for sponsor');
            }
            return {
                address: additionalFields.address,
            };
        case 'foodprovider':
            if (!additionalFields.restaurantAddress) {
                throw new Error('Missing required fields for food provider');
            }
           if(!additionalFields.restorantName){
            throw new Error('Missing required fields for food provider');
           }
            if (!additionalFields.area) {
                throw new Error('Missing required fields food provider');
            }
            
           
            return {
                area: additionalFields.area,
                restorantName: additionalFields.restorantName,
                restaurantAddress: additionalFields.restaurantAddress,
            }
        default:
            throw new Error('Invalid role');
    }
};

