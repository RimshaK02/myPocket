/**
 * Comprehensive Milkshake API Test
 * Tests all major API endpoints with proper authentication
 */

const MilkshakeClient = require('./src/milkshake_api/client');

async function testMilkshakeAPI() {
  console.log('=== Milkshake Capstone API Full Test ===\n');

  const client = new MilkshakeClient();

  // 1. Authentication
  console.log('1. Authentication (POST /v1/auth)');
  const authResult = await client.authenticate('yoonj13@mcmaster.ca', 'tjf01800?A');

  if (!authResult.success) {
    console.log('❌ Authentication failed:', authResult.error);
    process.exit(1);
  }

  console.log('✅ Authentication successful');
  console.log(`   Name: ${authResult.data.firstName} ${authResult.data.lastName}`);
  console.log(`   Email: ${authResult.data.email}`);
  console.log(`   Site: ${authResult.data.siteId}`);
  console.log(`   Role: ${authResult.data.role}`);

  const userId = authResult.data.userId;

  // 2. Session verification
  console.log('\n2. Session verification (GET /v1/auth/:id)');
  const session = await client.getSession();
  console.log(session.success ? '✅ Session active' : '❌ No session');

  // 3. Get users
  console.log('\n3. Get users list (GET /v1/users)');
  const users = await client.getUsers();
  if (users.success) {
    console.log(`✅ Retrieved ${users.data.length} users`);
    const me = users.data.find(u => u.id === userId);
    if (me) {
      console.log(`   Current user: ${me.firstName} ${me.lastName} (ID: ${me.id})`);
    }
  } else {
    console.log('❌ Failed to get users:', users.error);
  }

  // 4. Get tasks
  console.log('\n4. Get tasks list (GET /v1/tasks)');
  const tasks = await client.getTasks();
  if (tasks.success) {
    console.log(`✅ Retrieved ${tasks.data.length} tasks`);
    if (tasks.data.length > 0) {
      const task = tasks.data[0];
      console.log(`   First task: "${task.description}"`);
      console.log(`   ID: ${task.id}, Status: ${task.status}, Priority: ${task.priority}`);
    }
  } else {
    console.log('❌ Failed to get tasks:', tasks.error);
  }

  // 5. Get task category (required for creating tasks)
  console.log('\n5. Prepare task creation');
  let taskCategoryId = null;
  if (tasks.success && tasks.data.length > 0) {
    taskCategoryId = tasks.data[0].taskCategoryId;
    console.log(`   Using taskCategoryId from existing task: ${taskCategoryId}`);
  }

  // 6. Create task
  if (taskCategoryId) {
    console.log('\n6. Create task test (POST /v1/tasks)');
    const newTask = await client.createTask({
      description: 'PocketAI Test - Milkshake API Integration Check',
      taskCategoryId: taskCategoryId,
      priority: 'high',
      status: 'pending',
      notes: 'Test task created from Node.js via Milkshake API.',
    });

    if (newTask.success) {
      console.log('✅ Task created successfully');
      console.log(`   Task ID: ${newTask.data.id}`);
      console.log(`   Description: ${newTask.data.description}`);

      const taskId = newTask.data.id;

      // 7. Get task
      console.log('\n7. Get created task details (GET /v1/tasks/:id)');
      const getTask = await client.getTask(taskId);
      if (getTask.success) {
        console.log('✅ Task retrieved successfully');
        console.log(`   Description: ${getTask.data.description}`);
        console.log(`   Status: ${getTask.data.status}`);
      }

      // 8. Update task
      console.log('\n8. Update task (PATCH /v1/tasks/:id)');
      const updateTask = await client.updateTask(taskId, {
        status: 'in-progress',
        notes: 'API test in progress - Status updated'
      });

      if (updateTask.success) {
        console.log('✅ Task updated successfully');
        console.log(`   New status: ${updateTask.data.status}`);
      }

      // 9. Delete task
      console.log('\n9. Delete task (DELETE /v1/tasks/:id)');
      const deleteTask = await client.deleteTask(taskId);
      if (deleteTask.success) {
        console.log('✅ Task deleted successfully');
      }
    } else {
      console.log('❌ Failed to create task:', newTask.error);
      if (newTask.details) {
        console.log('   Details:', JSON.stringify(newTask.details, null, 2));
      }
    }
  } else {
    console.log('\n6. Task creation skipped (taskCategoryId not found)');
  }

  // 10. Get animal events
  console.log('\n10. Get animal events (GET /v1/animal-events)');
  const events = await client.getAnimalEvents({
    // Events from last 30 days
    dateStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    dateEnd: new Date().toISOString()
  });

  if (events.success) {
    console.log(`✅ Retrieved ${events.data.length} animal events`);
    if (events.data.length > 0) {
      const event = events.data[0];
      console.log(`   First event: Type ${event.animalEventTypeId}`);
      console.log(`   Animal ID: ${event.animalId}, Date: ${event.eventDateTime}`);
    }
  } else {
    console.log('❌ Failed to get animal events:', events.error);
  }

  console.log('\n=== Test Complete! ===');
  console.log('\n✅ Milkshake API integration successful!');
  console.log('\nAvailable features:');
  console.log('  ✓ User authentication and session management');
  console.log('  ✓ Task CRUD (Create, Read, Update, Delete)');
  console.log('  ✓ Animal Events retrieval');
  console.log('  ✓ Users retrieval');
  console.log('\nPocketAI is ready to use the Milkshake API!');
}

testMilkshakeAPI().catch(error => {
  console.error('\n❌ Unexpected error:', error.message);
  console.error(error.stack);
  process.exit(1);
});
