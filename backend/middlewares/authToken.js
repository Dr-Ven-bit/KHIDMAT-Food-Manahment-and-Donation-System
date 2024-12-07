const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('Decoded token in middleware:', req.user);  // Log to ensure it's there
        next();
    } catch (error) {
        console.log('Invalid or expired token', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = verifyJWT;


// const jwt = require('jsonwebtoken');

// const verifyJWT = (req, res, next) => {
//     console.log('req for token: ', req.headers.authorization);
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ message: 'Authorization token is required' });
//     }

//     const token = authHeader.split(' ')[1];
//     console.log('token: ', token);

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log('decoded token: ', decoded);
//         req.user = decoded; // Add the decoded token data to the request object
//         console.log(req.user);
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: 'Invalid or expired token' });
//     }
// };

// module.exports = verifyJWT;
