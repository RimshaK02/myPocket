const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // If MONGODB_URI already includes username/password, use as-is
    // Otherwise, replace placeholders with MONGODB_USERNAME and MONGODB_PASSWORD
    let mongoUri = process.env.MONGODB_URI;

    if (process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD) {
      mongoUri = mongoUri
        .replace('${MONGODB_USERNAME}', process.env.MONGODB_USERNAME)
        .replace('${MONGODB_PASSWORD}', process.env.MONGODB_PASSWORD);
    }

    const conn = await mongoose.connect(mongoUri, {
      // These options are defaults in MongoDB 6.0+
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // In development, keep server running even if DB connection fails
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
