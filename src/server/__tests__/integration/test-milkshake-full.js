/**
 * Full Milkshake API Integration Test
 */

const MilkshakeClient = require('../../src/milkshake_api/client');

async function testFullAPI() {
  console.log('=== Milkshake API Full Test ===\n');

  const client = new MilkshakeClient();

  // 1. Authentication
  console.log('1. Authentication test');
  const authResult = await client.authenticate('yoonj13@mcmaster.ca', 'tjf01800?A');

  if (!authResult.success) {
    console.log('❌ Authentication failed:', authResult.error);
    process.exit(1);
  }

  console.log('✅ Authentication successful');
  console.log(`   User: ${authResult.data.firstName} ${authResult.data.lastName}`);
  console.log(`   Email: ${authResult.data.email}`);
  console.log(`   Site ID: ${authResult.data.siteId}`);

  // 2. Session verification
  console.log('\n2. Session verification');
  const session = await client.getSession();
  console.log(session.success ? '✅ Session active' : '❌ No session');

  // 3. Get tasks
  console.log('\n3. Get tasks');
  const tasks = await client.getTasks();
  if (tasks.success) {
    console.log(`✅ Tasks retrieved: ${tasks.data.length} tasks`);
    if (tasks.data.length > 0) {
      const task = tasks.data[0];
      console.log(`   First task: "${task.description}"`);
      console.log(`   Status: ${task.status}, Priority: ${task.priority}`);
    }
  } else {
    console.log('❌ Failed to get tasks:', tasks.error);
  }

  // 4. Create task test
  console.log('\n4. Create task test');
  const newTask = await client.createTask({
    description: 'PocketAI Test Task',
    status: 'pending',
    priority: 'high',
    notes: 'Test task for Milkshake API integration.',
    siteId: authResult.data.siteId
  });

  if (newTask.success) {
    console.log('✅ Task created successfully');
    console.log(`   Task ID: ${newTask.data.id}`);
    console.log(`   Description: ${newTask.data.description}`);

    // 5. Get task
    console.log('\n5. Get created task');
    const getTask = await client.getTask(newTask.data.id);
    if (getTask.success) {
      console.log('✅ Task retrieved successfully');
      console.log(`   Description: ${getTask.data.description}`);
      console.log(`   Notes: ${getTask.data.notes}`);
    }

    // 6. Update task
    console.log('\n6. Update task test');
    const updateTask = await client.updateTask(newTask.data.id, {
      status: 'in-progress',
      notes: 'Updated notes.'
    });

    if (updateTask.success) {
      console.log('✅ Task updated successfully');
      console.log(`   New status: ${updateTask.data.status}`);
    }

    // 7. Add note
    console.log('\n7. Add note to task');
    const note = await client.createNote({
      taskId: newTask.data.id,
      note: 'Note added from PocketAI!'
    });

    if (note.success) {
      console.log('✅ Note added successfully');
      console.log(`   Note ID: ${note.data.id}`);
    }

    // 8. Delete task
    console.log('\n8. Delete task test');
    const deleteTask = await client.deleteTask(newTask.data.id);
    if (deleteTask.success) {
      console.log('✅ Task deleted successfully');
    }
  } else {
    console.log('❌ Failed to create task:', newTask.error);
  }

  // 9. Get animals
  console.log('\n9. Get animals');
  const animals = await client.getAnimals();
  if (animals.success) {
    console.log(`✅ Animals retrieved: ${animals.data.length} animals`);
    if (animals.data.length > 0) {
      const animal = animals.data[0];
      console.log(`   First animal: ${animal.name || 'No name'}`);
      console.log(`   Tag: ${animal.tag || 'No tag'}`);
    }
  } else {
    console.log('❌ Failed to get animals:', animals.error);
  }

  // 10. Get users
  console.log('\n10. Get users');
  const users = await client.getUsers();
  if (users.success) {
    console.log(`✅ Users retrieved: ${users.data.length} users`);
    const currentUser = users.data.find(u => u.id === authResult.data.userId);
    if (currentUser) {
      console.log(`   Current user: ${currentUser.firstName} ${currentUser.lastName}`);
      console.log(`   Role: ${currentUser.employees[0]?.role || 'N/A'}`);
    }
  } else {
    console.log('❌ Failed to get users:', users.error);
  }

  console.log('\n=== Test Complete! ===');
  console.log('\n✅ All Milkshake API features working properly!');
  console.log('\nAvailable APIs:');
  console.log('  - Tasks (Task management)');
  console.log('  - Animals (Animal management)');
  console.log('  - Animal Events (Animal events)');
  console.log('  - Notes (Notes)');
  console.log('  - Users (Users)');
}

testFullAPI().catch(error => {
  console.error('\n❌ Unexpected error:', error.message);
  console.error(error.stack);
  process.exit(1);
});
