require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');
const { importCommandLogsOnce } = require('./jobs/importCommandLogsJob');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
// Allow multiple origins for development (Expo on different ports)
const allowedOrigins = [
  'http://localhost:19000',  // Expo default
  'http://localhost:8081',   // Metro bundler web
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);

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

  // Periodic import of Trigger-word command_logs into MongoDB
  if (process.env.NODE_ENV !== 'test') {
    const defaultIntervalMs = 300000; // 5 minutes
    const intervalMs = parseInt(process.env.COMMAND_LOG_IMPORT_INTERVAL_MS || `${defaultIntervalMs}`, 10);

    const runImportJob = async () => {
      try {
        await importCommandLogsOnce();
      } catch (err) {
        console.error('Error running Trigger-word import job:', err.message || err);
      }
    };

    // Run once on startup
    runImportJob();

    // Then schedule periodically
    if (intervalMs > 0) {
      setInterval(runImportJob, intervalMs);
      console.log(`Trigger-word import job scheduled every ${intervalMs} ms.`);
    }
  }
});
