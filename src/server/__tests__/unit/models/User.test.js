const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../../src/models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('User Model Unit Tests', () => {
  describe('User Creation', () => {
    test('should create a user with valid email and password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'securePassword123'
      };

      const user = await User.create(userData);

      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Should be hashed
      expect(user._id).toBeDefined();
      expect(user.createdAt).toBeDefined();
    });

    test('should create a Milkshake user without password', async () => {
      const userData = {
        email: 'milkshake@example.com',
        milkshakeUserId: 123,
        milkshakeEmail: 'milkshake@example.com'
      };

      const user = await User.create(userData);

      expect(user.email).toBe(userData.email);
      expect(user.milkshakeUserId).toBe(123);
      expect(user.password).toBeUndefined();
    });

    test('should fail to create user with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'securePassword123'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should fail to create user without email', async () => {
      const userData = {
        password: 'securePassword123'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should fail to create non-Milkshake user without password', async () => {
      const userData = {
        email: 'test@example.com'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('Password Hashing', () => {
    test('should hash password before saving', async () => {
      const plainPassword = 'mySecretPassword123';
      const user = await User.create({
        email: 'hash@example.com',
        password: plainPassword
      });

      expect(user.password).not.toBe(plainPassword);
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt format
    });

    test('should not rehash password if not modified', async () => {
      const user = await User.create({
        email: 'rehash@example.com',
        password: 'password123'
      });

      const originalHash = user.password;
      user.email = 'newemail@example.com';
      await user.save();

      expect(user.password).toBe(originalHash);
    });
  });

  describe('Password Comparison', () => {
    test('should correctly validate matching password', async () => {
      const plainPassword = 'testPassword123';
      const user = await User.create({
        email: 'compare@example.com',
        password: plainPassword
      });

      const foundUser = await User.findById(user._id).select('+password');
      const isMatch = await foundUser.comparePassword(plainPassword);

      expect(isMatch).toBe(true);
    });

    test('should correctly reject non-matching password', async () => {
      const user = await User.create({
        email: 'compare2@example.com',
        password: 'correctPassword123'
      });

      const foundUser = await User.findById(user._id).select('+password');
      const isMatch = await foundUser.comparePassword('wrongPassword');

      expect(isMatch).toBe(false);
    });
  });

  describe('Unique Constraints', () => {
    test('should prevent duplicate email registration', async () => {
      await User.create({
        email: 'duplicate@example.com',
        password: 'password123'
      });

      await expect(User.create({
        email: 'duplicate@example.com',
        password: 'password456'
      })).rejects.toThrow(/duplicate key/);
    });

    test('should prevent duplicate milkshakeUserId', async () => {
      await User.create({
        email: 'user1@example.com',
        milkshakeUserId: 999
      });

      await expect(User.create({
        email: 'user2@example.com',
        milkshakeUserId: 999
      })).rejects.toThrow(/duplicate key/);
    });

    test('should allow multiple users with null milkshakeUserId', async () => {
      const user1 = await User.create({
        email: 'user1@example.com',
        password: 'password123'
      });

      const user2 = await User.create({
        email: 'user2@example.com',
        password: 'password123'
      });

      expect(user1.milkshakeUserId).toBeUndefined();
      expect(user2.milkshakeUserId).toBeUndefined();
      expect(user1._id).not.toEqual(user2._id);
    });
  });

  describe('Default Values', () => {
    test('should set default settings.autoApprove to false', async () => {
      const user = await User.create({
        email: 'defaults@example.com',
        password: 'password123'
      });

      expect(user.settings.autoApprove).toBe(false);
    });

    test('should set createdAt automatically', async () => {
      const user = await User.create({
        email: 'timestamp@example.com',
        password: 'password123'
      });

      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('Instance Methods', () => {
    test('updateLastLogin should update lastLogin timestamp', async () => {
      const user = await User.create({
        email: 'login@example.com',
        password: 'password123'
      });

      expect(user.lastLogin).toBeUndefined();

      await user.updateLastLogin();

      expect(user.lastLogin).toBeInstanceOf(Date);
      expect(user.lastLogin.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('Field Selection', () => {
    test('should not return password and refreshToken by default', async () => {
      await User.create({
        email: 'select@example.com',
        password: 'password123',
        refreshToken: 'someToken'
      });

      const user = await User.findOne({ email: 'select@example.com' });

      expect(user.password).toBeUndefined();
      expect(user.refreshToken).toBeUndefined();
    });

    test('should return password when explicitly selected', async () => {
      await User.create({
        email: 'selectpass@example.com',
        password: 'password123'
      });

      const user = await User.findOne({ email: 'selectpass@example.com' }).select('+password');

      expect(user.password).toBeDefined();
      expect(typeof user.password).toBe('string');
    });
  });
});
