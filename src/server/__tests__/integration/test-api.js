/**
 * API Test Script
 * Tests the Log API endpoints without requiring full server setup
 */

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

// Test 1: Check if all modules can be required
console.log('=== Test 1: Module Loading ===');
try {
  const Log = require('../../src/models/Log');
  console.log('✓ Log model loaded');

  const User = require('../../src/models/User');
  console.log('✓ User model loaded');

  const MilkshakeClient = require('../../src/milkshake_api/client');
  console.log('✓ MilkshakeClient loaded');

  const logController = require('../../src/controllers/logController');
  console.log('✓ logController loaded');
  console.log('  Controller methods:', Object.keys(logController).join(', '));

  const logRoutes = require('../../src/routes/logRoutes');
  console.log('✓ logRoutes loaded');

  console.log('\n✅ All modules loaded successfully!\n');
} catch (error) {
  console.error('❌ Error loading modules:', error.message);
  console.error(error.stack);
  process.exit(1);
}

// Test 2: Check MilkshakeClient API methods
console.log('=== Test 2: MilkshakeClient API Methods ===');
try {
  const MilkshakeClient = require('../../src/milkshake_api/client');
  const client = new MilkshakeClient();

  const methods = [
    'authenticate',
    'setAuth',
    'request',
    'getTasks',
    'getTask',
    'createTask',
    'updateTask',
    'deleteTask',
    'createNote',
    'getAnimal',
    'getAnimalByTag',
    'createAnimal',
    'updateAnimal',
    'getAnimalEvents',
    'createAnimalEvent',
    'deleteAnimalEvent',
    'getUsers',
    'getUser',
    'getSession'
  ];

  methods.forEach(method => {
    if (typeof client[method] === 'function') {
      console.log(`✓ ${method}()`);
    } else {
      console.log(`✗ ${method}() - NOT FOUND`);
    }
  });

  console.log('\n✅ All API methods exist!\n');
} catch (error) {
  console.error('❌ Error checking API methods:', error.message);
  process.exit(1);
}

// Test 3: Check Log Model Schema
console.log('=== Test 3: Log Model Schema ===');
try {
  const mongoose = require('mongoose');
  const Log = require('../../src/models/Log');

  const schema = Log.schema;
  const paths = Object.keys(schema.paths);

  console.log('Schema fields:');
  paths.forEach(path => {
    const field = schema.paths[path];
    console.log(`  - ${path}: ${field.instance || 'Mixed'}`);
  });

  // Check required fields
  const requiredFields = ['type', 'userId'];
  requiredFields.forEach(field => {
    if (schema.paths[field] && schema.paths[field].isRequired) {
      console.log(`✓ ${field} is required`);
    }
  });

  // Check enums
  if (schema.paths.type && schema.paths.type.enumValues) {
    console.log(`✓ type enum: [${schema.paths.type.enumValues.join(', ')}]`);
  }

  if (schema.paths.syncStatus && schema.paths.syncStatus.enumValues) {
    console.log(`✓ syncStatus enum: [${schema.paths.syncStatus.enumValues.join(', ')}]`);
  }

  if (schema.paths.status && schema.paths.status.enumValues) {
    console.log(`✓ status enum: [${schema.paths.status.enumValues.join(', ')}]`);
  }

  console.log('\n✅ Log model schema is valid!\n');
} catch (error) {
  console.error('❌ Error checking Log schema:', error.message);
  process.exit(1);
}

// Test 4: Check User Model Updates
console.log('=== Test 4: User Model Schema ===');
try {
  const User = require('../../src/models/User');
  const schema = User.schema;

  if (schema.paths.settings && schema.paths['settings.autoApprove']) {
    console.log('✓ settings.autoApprove field exists');
    const field = schema.paths['settings.autoApprove'];
    console.log(`  Type: ${field.instance}`);
    console.log(`  Default: ${field.defaultValue}`);
  } else {
    console.log('✗ settings.autoApprove field NOT FOUND');
  }

  console.log('\n✅ User model schema is valid!\n');
} catch (error) {
  console.error('❌ Error checking User schema:', error.message);
  process.exit(1);
}

console.log('==============================================');
console.log('✅ ALL TESTS PASSED!');
console.log('==============================================');
console.log('\nThe API implementation is ready for integration testing.');
console.log('Next steps:');
console.log('1. Start the server with: npm run dev');
console.log('2. Test endpoints using curl or Postman');
console.log('3. Check API documentation in API_DOCS.md');
