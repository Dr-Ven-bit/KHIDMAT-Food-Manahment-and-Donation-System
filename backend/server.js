const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authUsers = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middlewares/errorHandler');
const donationRoutes = require('./routes/sponsorRoute');
const foodProviderRoutes = require('./routes/foodproviderRoutes');
const coordinatorRoutes = require('./routes/coordinatorRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
// Load environment variables
dotenv.config();



const app = express();

//for file upload
const path = require('path');


// Serve static files (for screenshot uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Middleware
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests to enable CORS preflight
app.options('*', cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/auth', authUsers);
app.use('/admin', adminRoutes);
app.use('/sponsor', donationRoutes);
app.use('/food-provider', foodProviderRoutes);
app.use('/coordinator', coordinatorRoutes);
app.use('/volunteer', volunteerRoutes);
// Error handler middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
