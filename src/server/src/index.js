require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:19000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pocket AI Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
