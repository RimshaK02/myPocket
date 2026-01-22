# Pocket AI Server API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All `/api/logs/*` endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <accessToken>
```

### Authentication Methods

Pocket AI supports two authentication methods:
1. **Email/Password Authentication** - Standard registration and login
2. **Milkshake Integration** - Login with your Milkshake Capstone credentials

---

### POST /api/auth/register
Register a new user with email and password.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User email address |
| password | string | Yes | Password (min 6 characters) |

**Example Request:**
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123'
  })
});
```

**Example Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "email": "user@example.com",
      "createdAt": "2025-01-21T10:30:00.000Z"
    }
  }
}
```

---

### POST /api/auth/login
Login with email and password.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User email address |
| password | string | Yes | User password |

**Example Request:**
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123'
  })
});
```

**Example Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "email": "user@example.com",
      "lastLogin": "2025-01-21T10:30:00.000Z"
    }
  }
}
```

---

### POST /api/auth/milkshake/login
Login with Milkshake Capstone credentials. This authenticates with the Milkshake API and creates/links a user account.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Milkshake account email |
| password | string | Yes | Milkshake account password |

**Example Request:**
```javascript
const response = await fetch('/api/auth/milkshake/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'yoonj13@mcmaster.ca',
    password: 'yourMilkshakePassword'
  })
});
```

**Example Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "email": "yoonj13@mcmaster.ca",
      "milkshakeUserId": 123,
      "milkshakeEmail": "yoonj13@mcmaster.ca",
      "milkshakeData": {
        "firstName": "John",
        "lastName": "Doe",
        "siteId": 1,
        "role": "admin"
      },
      "lastLogin": "2025-01-21T10:30:00.000Z"
    },
    "milkshakeCookie": "connect.sid=s%3A..."
  }
}
```

**Note:** The `milkshakeCookie` is used internally for subsequent Milkshake API calls and is stored on the server.

---

### POST /api/auth/refresh
Refresh an expired access token using a refresh token.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| refreshToken | string | Yes | The refresh token received at login |

**Example Request:**
```javascript
const response = await fetch('/api/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
});
```

**Example Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** This uses a sliding window approach - both access and refresh tokens are regenerated.

---

### GET /api/auth/verify
Verify if the current access token is valid.

**Example Request:**
```javascript
const response = await fetch('/api/auth/verify', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**Example Response (Valid Token):**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "oid": "64f1a2b3c4d5e6f7a8b9c0d1",
    "email": "user@example.com"
  }
}
```

**Example Response (Invalid Token):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

### GET /api/auth/me
Get current authenticated user information.

**Example Request:**
```javascript
const response = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "email": "user@example.com",
    "milkshakeUserId": 123,
    "milkshakeEmail": "yoonj13@mcmaster.ca",
    "settings": {
      "autoApprove": false
    },
    "createdAt": "2025-01-20T10:00:00.000Z",
    "lastLogin": "2025-01-21T10:30:00.000Z"
  }
}
```

---

### POST /api/auth/logout
Logout the current user and invalidate refresh token.

**Example Request:**
```javascript
const response = await fetch('/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**Example Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### Token Management

**Access Token:**
- Short-lived (15 minutes)
- Used for all authenticated API requests
- Include in `Authorization: Bearer <accessToken>` header

**Refresh Token:**
- Long-lived (7 days)
- Used to obtain new access tokens
- Stored securely and sent to `/api/auth/refresh` when access token expires

**Example Token Refresh Flow:**
```javascript
// Store tokens after login
let accessToken = loginResponse.data.accessToken;
let refreshToken = loginResponse.data.refreshToken;

// Make API request
const makeAuthenticatedRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // If token expired, refresh and retry
    if (response.status === 401) {
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      const refreshData = await refreshResponse.json();
      accessToken = refreshData.data.accessToken;
      refreshToken = refreshData.data.refreshToken;

      // Retry original request with new token
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`
        }
      });
    }

    return response;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};
```

---

## Logs API

### GET /api/logs
Get all logs for the authenticated user.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter by log type: `task`, `note`, `animalEvent`, `animal` |
| status | string | Filter by status: `pending`, `approved`, `error` |
| syncStatus | string | Filter by sync status: `pending`, `synced`, `conflict`, `error` |
| limit | number | Max results (default: 50) |
| offset | number | Pagination offset (default: 0) |

**Example Request:**
```javascript
const response = await fetch('/api/logs?type=task&status=pending&limit=20', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "type": "task",
      "status": "pending",
      "syncStatus": "pending",
      "audio": {
        "localPath": "/path/to/audio.m4a",
        "duration": 5.2,
        "recordedAt": "2025-01-21T10:30:00.000Z"
      },
      "ai": {
        "transcript": "Feed cows in barn A",
        "confidence": 0.95,
        "processedAt": "2025-01-21T10:30:05.000Z"
      },
      "data": {
        "description": "Feed cows in barn A",
        "taskCategoryId": 5,
        "priority": "medium"
      },
      "createdAt": "2025-01-21T10:30:00.000Z",
      "updatedAt": "2025-01-21T10:30:05.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0
  }
}
```

---

### GET /api/logs/:id
Get a single log by ID.

**Example Request:**
```javascript
const response = await fetch('/api/logs/64f1a2b3c4d5e6f7a8b9c0d1', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

---

### POST /api/logs
Create a new log.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | `task`, `note`, `animalEvent`, `animal` |
| data | object | No | Type-specific data for Milkshake API |
| audio | object | No | Audio recording info |
| ai | object | No | AI processing result |

**Example Request:**
```javascript
const response = await fetch('/api/logs', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'task',
    audio: {
      localPath: '/path/to/recording.m4a',
      duration: 5.2,
      recordedAt: new Date().toISOString()
    },
    ai: {
      transcript: 'Feed cows in barn A',
      confidence: 0.95,
      processedAt: new Date().toISOString()
    },
    data: {
      description: 'Feed cows in barn A',
      taskCategoryId: 5,
      priority: 'medium'
    }
  })
});
```

**Note:** If user has `autoApprove: true`, the log will be automatically approved and synced to Milkshake.

---

### PATCH /api/logs/:id
Update an existing log.

**Request Body:**
| Field | Type | Description |
|-------|------|-------------|
| data | object | Updated type-specific data |
| audio | object | Updated audio info |
| ai | object | Updated AI result |
| status | string | Change status to `approved` or `error` |

**Example Request:**
```javascript
const response = await fetch('/api/logs/64f1a2b3c4d5e6f7a8b9c0d1', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    data: {
      description: 'Feed cows in barn A - Updated'
    }
  })
});
```

---

### DELETE /api/logs/:id
Delete a log. If synced with Milkshake, it will also be deleted there.

**Example Request:**
```javascript
const response = await fetch('/api/logs/64f1a2b3c4d5e6f7a8b9c0d1', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

---

### POST /api/logs/:id/approve
Approve a single pending log and sync to Milkshake.

**Example Request:**
```javascript
const response = await fetch('/api/logs/64f1a2b3c4d5e6f7a8b9c0d1/approve', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

---

### POST /api/logs/approve-all
Approve all pending logs and sync to Milkshake.

**Example Request:**
```javascript
const response = await fetch('/api/logs/approve-all', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**Example Response:**
```json
{
  "success": true,
  "message": "5 logs approved",
  "data": [...]
}
```

---

### POST /api/logs/sync
Manually sync all approved but unsynced logs to Milkshake.

**Example Request:**
```javascript
const response = await fetch('/api/logs/sync', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**Example Response:**
```json
{
  "success": true,
  "message": "Synced 3 logs, 1 failed",
  "data": {
    "synced": ["id1", "id2", "id3"],
    "failed": ["id4"]
  }
}
```

---

## Settings API

### GET /api/logs/settings
Get user settings.

**Example Request:**
```javascript
const response = await fetch('/api/logs/settings', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "autoApprove": false
  }
}
```

---

### PATCH /api/logs/settings
Update user settings.

**Request Body:**
| Field | Type | Description |
|-------|------|-------------|
| autoApprove | boolean | Enable/disable auto approval |

**Example Request:**
```javascript
const response = await fetch('/api/logs/settings', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    autoApprove: true
  })
});
```

---

## Data Schemas

### Log Types and Their Data Fields

#### Task (`type: 'task'`)
```json
{
  "data": {
    "description": "string (required)",
    "instructions": "string",
    "taskCategoryId": "number (required)",
    "priority": "high | medium | low",
    "status": "pending | in-progress | completed",
    "dueDate": "ISO date string",
    "assignedUserId": "number"
  }
}
```

#### Note (`type: 'note'`)
```json
{
  "data": {
    "body": "string (required)",
    "animalId": "number",
    "penId": "number",
    "tags": ["string"],
    "imageUrls": ["string"]
  }
}
```

#### Animal Event (`type: 'animalEvent'`)
```json
{
  "data": {
    "animalIds": ["number (required)"],
    "animalEventTypeId": "number (required)",
    "eventDateTime": "ISO date string (required)",
    "notes": "string",
    "penId": "number",
    "sireId": "number",
    "weight": "number",
    "temperature": "number"
  }
}
```

#### Animal (`type: 'animal'`)
```json
{
  "data": {
    "primaryTag": "string",
    "name": "string",
    "genderId": "number (required)",
    "breedId": "number",
    "birthDate": "ISO date string"
  }
}
```

---

## Typical Usage Flow

### 1. Recording and Creating Log (Hands-free mode)
```javascript
// After voice recording and AI processing
const createLog = async (audioPath, transcript, parsedData) => {
  const response = await fetch('/api/logs', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: parsedData.type,  // AI determines type
      audio: {
        localPath: audioPath,
        duration: audioDuration,
        recordedAt: new Date().toISOString()
      },
      ai: {
        transcript: transcript,
        confidence: parsedData.confidence,
        processedAt: new Date().toISOString()
      },
      data: parsedData.data  // AI-parsed Milkshake data
    })
  });

  return response.json();
};
```

### 2. Display Logs in UI
```javascript
// Fetch pending and approved logs
const fetchLogs = async () => {
  const [pending, approved] = await Promise.all([
    fetch('/api/logs?status=pending').then(r => r.json()),
    fetch('/api/logs?status=approved').then(r => r.json())
  ]);

  return { pending: pending.data, approved: approved.data };
};
```

### 3. Approve All (UI "Approve All" button)
```javascript
const handleApproveAll = async () => {
  const response = await fetch('/api/logs/approve-all', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const result = await response.json();
  console.log(`${result.data.length} logs approved and synced`);
};
```

### 4. Toggle Auto-Approve Setting
```javascript
const toggleAutoApprove = async (enabled) => {
  await fetch('/api/logs/settings', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ autoApprove: enabled })
  });
};
```

### 5. Offline Sync (when back online)
```javascript
const syncOfflineLogs = async () => {
  const response = await fetch('/api/logs/sync', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const result = await response.json();
  console.log(`Synced: ${result.data.synced.length}, Failed: ${result.data.failed.length}`);
};
```

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

Common HTTP status codes:
- `400` - Bad request (missing required fields)
- `401` - Unauthorized (invalid or missing token)
- `404` - Resource not found
- `500` - Server error
