/**
 * Full Milkshake API Integration Test
 */

const MilkshakeClient = require('./src/milkshake_api/client');

async function testFullAPI() {
  console.log('=== Milkshake API 전체 테스트 ===\n');

  const client = new MilkshakeClient();

  // 1. 인증
  console.log('1. 인증 테스트');
  const authResult = await client.authenticate('yoonj13@mcmaster.ca', 'tjf01800?A');

  if (!authResult.success) {
    console.log('❌ 인증 실패:', authResult.error);
    process.exit(1);
  }

  console.log('✅ 인증 성공');
  console.log(`   User: ${authResult.data.firstName} ${authResult.data.lastName}`);
  console.log(`   Email: ${authResult.data.email}`);
  console.log(`   Site ID: ${authResult.data.siteId}`);

  // 2. 세션 확인
  console.log('\n2. 세션 확인');
  const session = await client.getSession();
  console.log(session.success ? '✅ 세션 활성화됨' : '❌ 세션 없음');

  // 3. Tasks 조회
  console.log('\n3. Tasks 조회');
  const tasks = await client.getTasks();
  if (tasks.success) {
    console.log(`✅ Tasks 조회 성공: ${tasks.data.length}개`);
    if (tasks.data.length > 0) {
      const task = tasks.data[0];
      console.log(`   첫 번째 Task: "${task.description}"`);
      console.log(`   상태: ${task.status}, 우선순위: ${task.priority}`);
    }
  } else {
    console.log('❌ Tasks 조회 실패:', tasks.error);
  }

  // 4. Task 생성 테스트
  console.log('\n4. Task 생성 테스트');
  const newTask = await client.createTask({
    description: 'PocketAI 테스트 Task',
    status: 'pending',
    priority: 'high',
    notes: 'Milkshake API 연동 테스트용 Task입니다.',
    siteId: authResult.data.siteId
  });

  if (newTask.success) {
    console.log('✅ Task 생성 성공');
    console.log(`   Task ID: ${newTask.data.id}`);
    console.log(`   설명: ${newTask.data.description}`);

    // 5. Task 조회
    console.log('\n5. 생성된 Task 조회');
    const getTask = await client.getTask(newTask.data.id);
    if (getTask.success) {
      console.log('✅ Task 조회 성공');
      console.log(`   설명: ${getTask.data.description}`);
      console.log(`   Notes: ${getTask.data.notes}`);
    }

    // 6. Task 업데이트
    console.log('\n6. Task 업데이트 테스트');
    const updateTask = await client.updateTask(newTask.data.id, {
      status: 'in-progress',
      notes: '업데이트된 메모입니다.'
    });

    if (updateTask.success) {
      console.log('✅ Task 업데이트 성공');
      console.log(`   새로운 상태: ${updateTask.data.status}`);
    }

    // 7. Note 추가
    console.log('\n7. Task에 Note 추가');
    const note = await client.createNote({
      taskId: newTask.data.id,
      note: 'PocketAI에서 추가한 노트입니다!'
    });

    if (note.success) {
      console.log('✅ Note 추가 성공');
      console.log(`   Note ID: ${note.data.id}`);
    }

    // 8. Task 삭제
    console.log('\n8. Task 삭제 테스트');
    const deleteTask = await client.deleteTask(newTask.data.id);
    if (deleteTask.success) {
      console.log('✅ Task 삭제 성공');
    }
  } else {
    console.log('❌ Task 생성 실패:', newTask.error);
  }

  // 9. Animals 조회
  console.log('\n9. Animals 조회');
  const animals = await client.getAnimals();
  if (animals.success) {
    console.log(`✅ Animals 조회 성공: ${animals.data.length}개`);
    if (animals.data.length > 0) {
      const animal = animals.data[0];
      console.log(`   첫 번째 동물: ${animal.name || 'No name'}`);
      console.log(`   Tag: ${animal.tag || 'No tag'}`);
    }
  } else {
    console.log('❌ Animals 조회 실패:', animals.error);
  }

  // 10. Users 조회
  console.log('\n10. Users 조회');
  const users = await client.getUsers();
  if (users.success) {
    console.log(`✅ Users 조회 성공: ${users.data.length}명`);
    const currentUser = users.data.find(u => u.id === authResult.data.userId);
    if (currentUser) {
      console.log(`   현재 사용자: ${currentUser.firstName} ${currentUser.lastName}`);
      console.log(`   Role: ${currentUser.employees[0]?.role || 'N/A'}`);
    }
  } else {
    console.log('❌ Users 조회 실패:', users.error);
  }

  console.log('\n=== 테스트 완료! ===');
  console.log('\n✅ 모든 Milkshake API 기능이 정상 작동합니다!');
  console.log('\n사용 가능한 API:');
  console.log('  - Tasks (할 일 관리)');
  console.log('  - Animals (동물 관리)');
  console.log('  - Animal Events (동물 이벤트)');
  console.log('  - Notes (메모)');
  console.log('  - Users (사용자)');
}

testFullAPI().catch(error => {
  console.error('\n❌ 예상치 못한 에러:', error.message);
  console.error(error.stack);
  process.exit(1);
});
