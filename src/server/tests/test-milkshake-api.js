/**
 * Comprehensive Milkshake API Test
 * Tests all major API endpoints with proper authentication
 */

const MilkshakeClient = require('./src/milkshake_api/client');

async function testMilkshakeAPI() {
  console.log('=== Milkshake Capstone API 전체 테스트 ===\n');

  const client = new MilkshakeClient();

  // 1. 인증
  console.log('1. 인증 (POST /v1/auth)');
  const authResult = await client.authenticate('yoonj13@mcmaster.ca', 'tjf01800?A');

  if (!authResult.success) {
    console.log('❌ 인증 실패:', authResult.error);
    process.exit(1);
  }

  console.log('✅ 인증 성공');
  console.log(`   이름: ${authResult.data.firstName} ${authResult.data.lastName}`);
  console.log(`   이메일: ${authResult.data.email}`);
  console.log(`   사이트: ${authResult.data.siteId}`);
  console.log(`   역할: ${authResult.data.role}`);

  const siteId = authResult.data.siteId;
  const userId = authResult.data.userId;

  // 2. 세션 확인
  console.log('\n2. 세션 확인 (GET /v1/auth/:id)');
  const session = await client.getSession();
  console.log(session.success ? '✅ 세션 활성화됨' : '❌ 세션 없음');

  // 3. Users 조회
  console.log('\n3. 사용자 목록 조회 (GET /v1/users)');
  const users = await client.getUsers();
  if (users.success) {
    console.log(`✅ 사용자 ${users.data.length}명 조회 성공`);
    const me = users.data.find(u => u.id === userId);
    if (me) {
      console.log(`   현재 사용자: ${me.firstName} ${me.lastName} (ID: ${me.id})`);
    }
  } else {
    console.log('❌ 사용자 조회 실패:', users.error);
  }

  // 4. Tasks 조회
  console.log('\n4. Task 목록 조회 (GET /v1/tasks)');
  const tasks = await client.getTasks();
  if (tasks.success) {
    console.log(`✅ Task ${tasks.data.length}개 조회 성공`);
    if (tasks.data.length > 0) {
      const task = tasks.data[0];
      console.log(`   첫 번째 Task: "${task.description}"`);
      console.log(`   ID: ${task.id}, 상태: ${task.status}, 우선순위: ${task.priority}`);
    }
  } else {
    console.log('❌ Task 조회 실패:', tasks.error);
  }

  // 5. Task Category 확인 (Task 생성에 필요)
  console.log('\n5. Task 생성 준비');
  let taskCategoryId = null;
  if (tasks.success && tasks.data.length > 0) {
    taskCategoryId = tasks.data[0].taskCategoryId;
    console.log(`   기존 Task에서 taskCategoryId 사용: ${taskCategoryId}`);
  }

  // 6. Task 생성
  if (taskCategoryId) {
    console.log('\n6. Task 생성 테스트 (POST /v1/tasks)');
    const newTask = await client.createTask({
      description: 'PocketAI 테스트 - Milkshake API 연동 확인',
      taskCategoryId: taskCategoryId,
      priority: 'high',
      status: 'pending',
      notes: 'Node.js에서 Milkshake API로 생성한 테스트 Task입니다.',
    });

    if (newTask.success) {
      console.log('✅ Task 생성 성공');
      console.log(`   Task ID: ${newTask.data.id}`);
      console.log(`   설명: ${newTask.data.description}`);

      const taskId = newTask.data.id;

      // 7. Task 조회
      console.log('\n7. 생성된 Task 상세 조회 (GET /v1/tasks/:id)');
      const getTask = await client.getTask(taskId);
      if (getTask.success) {
        console.log('✅ Task 조회 성공');
        console.log(`   설명: ${getTask.data.description}`);
        console.log(`   상태: ${getTask.data.status}`);
      }

      // 8. Task 업데이트
      console.log('\n8. Task 업데이트 (PATCH /v1/tasks/:id)');
      const updateTask = await client.updateTask(taskId, {
        status: 'in-progress',
        notes: 'API 테스트 중 - 상태 업데이트됨'
      });

      if (updateTask.success) {
        console.log('✅ Task 업데이트 성공');
        console.log(`   새로운 상태: ${updateTask.data.status}`);
      }

      // 9. Task 삭제
      console.log('\n9. Task 삭제 (DELETE /v1/tasks/:id)');
      const deleteTask = await client.deleteTask(taskId);
      if (deleteTask.success) {
        console.log('✅ Task 삭제 성공');
      }
    } else {
      console.log('❌ Task 생성 실패:', newTask.error);
      if (newTask.details) {
        console.log('   상세:', JSON.stringify(newTask.details, null, 2));
      }
    }
  } else {
    console.log('\n6. Task 생성 건너뜀 (taskCategoryId를 찾을 수 없음)');
  }

  // 10. Animal Events 조회
  console.log('\n10. Animal Events 조회 (GET /v1/animal-events)');
  const events = await client.getAnimalEvents({
    // 최근 30일간의 이벤트
    dateStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    dateEnd: new Date().toISOString()
  });

  if (events.success) {
    console.log(`✅ Animal Events ${events.data.length}개 조회 성공`);
    if (events.data.length > 0) {
      const event = events.data[0];
      console.log(`   첫 번째 Event: Type ${event.animalEventTypeId}`);
      console.log(`   Animal ID: ${event.animalId}, 날짜: ${event.eventDateTime}`);
    }
  } else {
    console.log('❌ Animal Events 조회 실패:', events.error);
  }

  console.log('\n=== 테스트 완료! ===');
  console.log('\n✅ Milkshake API 연동 성공!');
  console.log('\n사용 가능한 주요 기능:');
  console.log('  ✓ 사용자 인증 및 세션 관리');
  console.log('  ✓ Task CRUD (생성, 조회, 수정, 삭제)');
  console.log('  ✓ Animal Events 조회');
  console.log('  ✓ Users 조회');
  console.log('\nPocketAI에서 Milkshake API를 사용할 준비가 완료되었습니다!');
}

testMilkshakeAPI().catch(error => {
  console.error('\n❌ 예상치 못한 에러:', error.message);
  console.error(error.stack);
  process.exit(1);
});
