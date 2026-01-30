/**
 * Test Milkshake API directly
 */

const MilkshakeClient = require('../../src/milkshake_api/client');

async function testMilkshakeAPI() {
  console.log('=== Testing Milkshake API ===\n');

  const client = new MilkshakeClient();

  // Test 1: Authentication
  console.log('Test 1: Authentication');
  const authResult = await client.authenticate('yoonj13@mcmaster.ca', 'tjf01800?A');

  if (authResult.success) {
    console.log('✅ Authentication successful!');
    console.log('Token:', authResult.token ? 'Present' : 'Not present');
    console.log('Cookie:', authResult.cookie ? authResult.cookie.substring(0, 50) + '...' : 'Not present');
    console.log('User data:', JSON.stringify(authResult.data, null, 2));
  } else {
    console.log('❌ Authentication failed');
    console.log('Error:', authResult.error);
    console.log('Details:', authResult.details);
    process.exit(1);
  }

  // Test 2: Get Session (verify we're logged in)
  console.log('\n\nTest 2: Get Session');
  const sessionResult = await client.getSession();

  if (sessionResult.success) {
    console.log('✅ Session retrieved!');
    console.log('Session data:', JSON.stringify(sessionResult.data, null, 2));
  } else {
    console.log('❌ Failed to get session');
    console.log('Error:', sessionResult.error);
  }

  // Test 3: Get Users
  console.log('\n\nTest 3: Get Users');
  const usersResult = await client.getUsers();

  if (usersResult.success) {
    console.log('✅ Users retrieved!');
    console.log(`Found ${usersResult.data?.length || 0} users`);
    if (usersResult.data && usersResult.data.length > 0) {
      console.log('First user:', JSON.stringify(usersResult.data[0], null, 2));
    }
  } else {
    console.log('❌ Failed to get users');
    console.log('Error:', usersResult.error);
  }

  // Test 4: Get Tasks
  console.log('\n\nTest 4: Get Tasks');
  const tasksResult = await client.getTasks();

  if (tasksResult.success) {
    console.log('✅ Tasks retrieved!');
    console.log(`Found ${tasksResult.data?.length || 0} tasks`);
    if (tasksResult.data && tasksResult.data.length > 0) {
      console.log('First task:', JSON.stringify(tasksResult.data[0], null, 2));
    }
  } else {
    console.log('❌ Failed to get tasks');
    console.log('Error:', tasksResult.error);
  }

  console.log('\n\n=== Test Complete ===');
}

testMilkshakeAPI().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
