# Docker 아키텍처 설명

## 📦 현재 구조

프로젝트에는 **3가지 Docker 실행 방법**이 있어요:

### 1. **개별 실행 (현재 방식)**

#### UI만 실행:
```bash
# 루트 디렉토리에서
docker compose up
```
- 포트: 19000 (Expo dev server)
- 컨테이너: `pocket-ai-ui`

#### 서버만 실행:
```bash
cd src/server
docker compose up
```
- 포트: 3000 (API server)
- 컨테이너: `pocket-ai-server`

**연동 방식:**
- UI → `http://localhost:3000/api` → 서버
- 두 컨테이너가 **별도 네트워크**에서 실행
- 호스트(localhost)를 통해 통신

---

### 2. **통합 실행 (추천)**

```bash
# 루트 디렉토리에서
docker compose -f docker-compose.unified.yml up
```

**장점:**
- ✅ 서버와 UI가 **같은 네트워크**에서 실행
- ✅ UI에서 `http://server:3000/api`로 직접 연결 (컨테이너 이름 사용)
- ✅ `depends_on`으로 서버가 준비된 후 UI 시작
- ✅ 한 번의 명령어로 전체 시스템 실행
- ✅ 더 빠른 네트워크 통신 (Docker 내부 네트워크)

**네트워크 구조:**
```
Docker Network (pocket-ai-network)
├── server (pocket-ai-server) :3000
└── ui (pocket-ai-ui) :19000

외부에서 접근:
- localhost:3000 → server
- localhost:19000 → ui
```

---

## 🔗 UI와 서버 연동 방법

### 방법 1: localhost 사용 (현재 방식)

**UI 코드 예시:**
```typescript
// src/UI/services/authService.ts
const API_URL = 'http://localhost:3000/api';

export const register = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

**문제점:**
- 모바일 실제 디바이스에서는 `localhost`가 작동하지 않음
- 같은 WiFi의 컴퓨터 IP 주소 사용 필요 (예: `192.168.1.100:3000`)

---

### 방법 2: 환경변수 사용 (유연함)

**.env 파일:**
```env
# 개발 환경
API_URL=http://localhost:3000/api

# 실제 디바이스 테스트
# API_URL=http://192.168.1.100:3000/api

# 프로덕션 (학교 SSH 서버)
# API_URL=https://your-server.mcmaster.ca/api
```

**UI 코드:**
```typescript
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
```

---

### 방법 3: Docker 컨테이너 이름 사용 (통합 실행시)

**unified docker-compose 사용시:**
```typescript
// Docker 내부에서 실행될 때
const API_URL = process.env.API_URL || 'http://server:3000/api';
```

이 방법은 UI도 Docker 컨테이너 안에서 실행될 때만 작동해요.

---

## 🚀 추천 개발 워크플로우

### 로컬 개발 (UI 코드 자주 수정):

```bash
# 터미널 1: 서버만 Docker로 실행
cd src/server
docker compose up

# 터미널 2: UI는 로컬에서 직접 실행 (빠른 리로드)
cd src/UI
npm start
```

**이유:**
- UI는 코드 변경이 잦아서 로컬이 더 빠름
- 서버는 Docker로 실행해서 MongoDB 연결 안정적

---

### 전체 시스템 테스트:

```bash
# 루트 디렉토리에서
docker compose -f docker-compose.unified.yml up
```

**이유:**
- 프로덕션 환경과 유사
- 전체 시스템 동작 확인

---

## 📱 모바일 실제 디바이스에서 테스트

### 1. 컴퓨터 IP 주소 확인:

**Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**예시 출력:**
```
inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255
```

### 2. UI에서 API URL 설정:

```typescript
// src/UI/config/api.ts
const getApiUrl = () => {
  if (__DEV__) {
    // 개발 모드: 실제 디바이스용
    return 'http://192.168.1.100:3000/api';
  }
  // 프로덕션
  return 'https://your-server.mcmaster.ca/api';
};

export const API_URL = getApiUrl();
```

### 3. 서버 CORS 설정 확인:

서버의 `.env` 파일에서:
```env
FRONTEND_URL=http://192.168.1.100:19000
```

또는 모든 origin 허용 (개발 중):
```javascript
// src/server/src/index.js
app.use(cors({
  origin: '*',  // 개발 중에만 사용
  credentials: true
}));
```

---

## 🏫 학교 SSH 서버 배포 시나리오

### 서버만 배포:

```bash
# SSH 서버에서
cd pocket-ai/src/server
docker compose up -d
```

### UI는 Expo/Vercel 등에서 호스팅:

```typescript
// UI의 프로덕션 API URL
const API_URL = 'https://your-ssh-server.mcmaster.ca:3000/api';
```

---

## 🎯 현재 상황 요약

**지금 상태:**
- ✅ 서버: Docker로 실행 중 (`localhost:3000`)
- ✅ UI: 별도 Docker로 실행 가능 (`localhost:19000`)
- ✅ 연동: HTTP 요청으로 localhost 통신

**다음 단계:**
1. UI에 API 서비스 파일 만들기
2. 로그인/회원가입 화면 구현
3. JWT 토큰을 AsyncStorage에 저장
4. 인증된 API 요청에 토큰 첨부

---

## 💡 팁

### Docker 명령어:

```bash
# 모든 컨테이너 확인
docker ps -a

# 특정 컨테이너 로그
docker logs pocket-ai-server
docker logs pocket-ai-ui

# 컨테이너 중지
docker compose down

# 볼륨까지 삭제 (완전 초기화)
docker compose down -v

# 특정 docker-compose 파일 사용
docker compose -f docker-compose.unified.yml up
```

### 네트워크 디버깅:

```bash
# 서버 컨테이너에서 UI로 ping
docker exec pocket-ai-server ping pocket-ai-ui

# UI 컨테이너에서 서버로 연결 테스트
docker exec pocket-ai-ui wget http://server:3000/health
```
