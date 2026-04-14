require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const config = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const referralRoutes = require('./routes/referralRoutes');

const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/referrals', referralRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${config.env} mode`);
});
