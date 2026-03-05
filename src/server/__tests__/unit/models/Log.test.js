const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Log = require('../../../src/models/Log');
const User = require('../../../src/models/User');

let mongoServer;
let testUser;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  testUser = await User.create({
    email: 'testuser@example.com',
    password: 'password123'
  });
});

afterEach(async () => {
  await Log.deleteMany({});
  await User.deleteMany({});
});

describe('Log Model Unit Tests', () => {
  describe('Log Creation', () => {
    test('should create a log with valid data', async () => {
      const logData = {
        type: 'task',
        userId: testUser._id,
        data: {
          description: 'Test task',
          priority: 'high'
        }
      };

      const log = await Log.create(logData);

      expect(log.type).toBe('task');
      expect(log.userId.toString()).toBe(testUser._id.toString());
      expect(log.status).toBe('pending'); // Default
      expect(log.syncStatus).toBe('pending'); // Default
    });

    test('should fail to create log without type', async () => {
      const logData = {
        userId: testUser._id,
        data: { description: 'Test' }
      };

      await expect(Log.create(logData)).rejects.toThrow();
    });

    test('should fail to create log without userId', async () => {
      const logData = {
        type: 'task',
        data: { description: 'Test' }
      };

      await expect(Log.create(logData)).rejects.toThrow();
    });

    test('should fail with invalid type enum value', async () => {
      const logData = {
        type: 'invalidType',
        userId: testUser._id,
        data: {}
      };

      await expect(Log.create(logData)).rejects.toThrow();
    });
  });

  describe('Log Types', () => {
    test('should accept all valid log types', async () => {
      const types = ['task', 'note', 'animalEvent', 'animal'];

      for (const type of types) {
        const log = await Log.create({
          type,
          userId: testUser._id,
          data: {}
        });

        expect(log.type).toBe(type);
      }
    });
  });

  describe('Default Values', () => {
    test('should set default status to pending', async () => {
      const log = await Log.create({
        type: 'task',
        userId: testUser._id,
        data: {}
      });

      expect(log.status).toBe('pending');
    });

    test('should set default syncStatus to pending', async () => {
      const log = await Log.create({
        type: 'note',
        userId: testUser._id,
        data: {}
      });

      expect(log.syncStatus).toBe('pending');
    });

    test('should set milkshakeId to null by default', async () => {
      const log = await Log.create({
        type: 'task',
        userId: testUser._id,
        data: {}
      });

      expect(log.milkshakeId).toBeNull();
    });

    test('should initialize empty data object', async () => {
      const log = await Log.create({
        type: 'task',
        userId: testUser._id
      });

      expect(log.data).toEqual({});
    });
  });

  describe('Audio and AI Fields', () => {
    test('should store audio metadata', async () => {
      const audioData = {
        localPath: '/path/to/audio.m4a',
        duration: 5.2,
        recordedAt: new Date()
      };

      const log = await Log.create({
        type: 'task',
        userId: testUser._id,
        audio: audioData,
        data: {}
      });

      expect(log.audio.localPath).toBe(audioData.localPath);
      expect(log.audio.duration).toBe(audioData.duration);
      expect(log.audio.recordedAt).toBeInstanceOf(Date);
    });

    test('should store AI processing results', async () => {
      const aiData = {
        transcript: 'Feed the cows',
        confidence: 0.95,
        processedAt: new Date()
      };

      const log = await Log.create({
        type: 'task',
        userId: testUser._id,
        ai: aiData,
        data: {}
      });

      expect(log.ai.transcript).toBe(aiData.transcript);
      expect(log.ai.confidence).toBe(0.95);
      expect(log.ai.processedAt).toBeInstanceOf(Date);
    });

    test('should validate AI confidence range', async () => {
      const logData = {
        type: 'task',
        userId: testUser._id,
        ai: { confidence: 1.5 },
        data: {}
      };

      await expect(Log.create(logData)).rejects.toThrow(/more than maximum allowed value/);
    });
  });

  describe('Instance Methods', () => {
    test('approve() should update status and approvedAt', async () => {
      const log = await Log.create({
        type: 'task',
        userId: testUser._id,
        data: {}
      });

      expect(log.status).toBe('pending');
      expect(log.approvedAt).toBeNull();

      await log.approve();

      expect(log.status).toBe('approved');
      expect(log.approvedAt).toBeInstanceOf(Date);
    });

    test('markSynced() should update sync fields', async () => {
      const log = await Log.create({
        type: 'task',
        userId: testUser._id,
        status: 'approved',
        data: {}
      });

      await log.markSynced(999);

      expect(log.milkshakeId).toBe(999);
      expect(log.syncStatus).toBe('synced');
      expect(log.milkshakeSyncedAt).toBeInstanceOf(Date);
      expect(log.syncError).toBeNull();
    });

    test('markSyncError() should update sync error fields', async () => {
      const log = await Log.create({
        type: 'task',
        userId: testUser._id,
        status: 'approved',
        data: {}
      });

      const errorMessage = 'Network timeout';
      await log.markSyncError(errorMessage);

      expect(log.syncStatus).toBe('error');
      expect(log.syncError).toBe(errorMessage);
    });
  });

  describe('Static Methods', () => {
    test('findPendingSync() should return approved but unsynced logs', async () => {
      // Create various logs
      await Log.create({
        type: 'task',
        userId: testUser._id,
        status: 'pending', // Not approved
        syncStatus: 'pending',
        data: {}
      });

      await Log.create({
        type: 'task',
        userId: testUser._id,
        status: 'approved',
        syncStatus: 'synced', // Already synced
        data: {}
      });

      const pendingLog = await Log.create({
        type: 'task',
        userId: testUser._id,
        status: 'approved',
        syncStatus: 'pending', // Should be returned
        data: {}
      });

      const results = await Log.findPendingSync(testUser._id);

      expect(results).toHaveLength(1);
      expect(results[0]._id.toString()).toBe(pendingLog._id.toString());
    });

    test('findPendingSync() should return logs in chronological order', async () => {
      const log1 = await Log.create({
        type: 'task',
        userId: testUser._id,
        status: 'approved',
        syncStatus: 'pending',
        data: {},
        createdAt: new Date('2025-01-01')
      });

      const log2 = await Log.create({
        type: 'task',
        userId: testUser._id,
        status: 'approved',
        syncStatus: 'pending',
        data: {},
        createdAt: new Date('2025-01-02')
      });

      const results = await Log.findPendingSync(testUser._id);

      expect(results).toHaveLength(2);
      expect(results[0]._id.toString()).toBe(log1._id.toString());
      expect(results[1]._id.toString()).toBe(log2._id.toString());
    });
  });

  describe('Data Storage with Mixed Type', () => {
    test('should store task-specific data', async () => {
      const taskData = {
        description: 'Feed cows',
        taskCategoryId: 5,
        priority: 'high',
        status: 'pending'
      };

      const log = await Log.create({
        type: 'task',
        userId: testUser._id,
        data: taskData
      });

      expect(log.data.description).toBe(taskData.description);
      expect(log.data.taskCategoryId).toBe(5);
      expect(log.data.priority).toBe('high');
    });

    test('should store note-specific data', async () => {
      const noteData = {
        body: 'Cow 123 looks healthy',
        animalId: 123,
        tags: ['health', 'observation']
      };

      const log = await Log.create({
        type: 'note',
        userId: testUser._id,
        data: noteData
      });

      expect(log.data.body).toBe(noteData.body);
      expect(log.data.animalId).toBe(123);
      expect(log.data.tags).toEqual(['health', 'observation']);
    });

    test('should store animalEvent-specific data', async () => {
      const eventData = {
        animalIds: [100, 101, 102],
        animalEventTypeId: 3,
        eventDateTime: new Date(),
        note: 'Vaccination completed'
      };

      const log = await Log.create({
        type: 'animalEvent',
        userId: testUser._id,
        data: eventData
      });

      expect(log.data.animalIds).toEqual([100, 101, 102]);
      expect(log.data.animalEventTypeId).toBe(3);
      expect(log.data.note).toBe('Vaccination completed');
    });
  });

  describe('Sync Status Enum', () => {
    test('should accept all valid syncStatus values', async () => {
      const statuses = ['pending', 'synced', 'conflict', 'error'];

      for (const syncStatus of statuses) {
        const log = await Log.create({
          type: 'task',
          userId: testUser._id,
          syncStatus,
          data: {}
        });

        expect(log.syncStatus).toBe(syncStatus);
      }
    });

    test('should reject invalid syncStatus values', async () => {
      const logData = {
        type: 'task',
        userId: testUser._id,
        syncStatus: 'invalidStatus',
        data: {}
      };

      await expect(Log.create(logData)).rejects.toThrow();
    });
  });
});
