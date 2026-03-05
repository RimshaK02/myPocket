require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');

(async () => {
  try {
    await connectDB();
    const users = await User.find({}, { email: 1, milkshakeUserId: 1, createdAt: 1 }).lean();
    console.log('Users in database:');
    users.forEach((u, idx) => {
      console.log(`${idx + 1}. email=${u.email || 'N/A'}, milkshakeUserId=${u.milkshakeUserId || 'N/A'}, createdAt=${u.createdAt}`);
    });
  } catch (err) {
    console.error('Error listing users:', err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
