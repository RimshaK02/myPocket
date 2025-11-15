# Pocket AI - Authentication Server

JWT-based authentication server (Email/Password + Google OAuth support)

## 🚀 Features

- ✅ Email/Password registration and login
- ✅ Google OAuth 2.0 social login
- ✅ JWT token-based authentication (includes iss, aud, oid)
- ✅ Password validation (minimum 10 characters, 1 uppercase letter, 1 special character)
- ✅ MongoDB Atlas integration
- ✅ bcrypt password hashing

## 📋 Prerequisites

### 1. Create MongoDB Atlas Account

1. Create a free account at https://www.mongodb.com/cloud/atlas/register
2. Create a new cluster (Free tier M0)
3. Create a user in Database Access (username, password)
4. Configure IP whitelist in Network Access (0.0.0.0/0 or specific IP)
5. Click "Connect" → "Connect your application"
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 2. Google OAuth Setup (Optional)

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Navigate to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Add Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/google/callback
   ```
7. Copy the Client ID and Client Secret

## 🛠️ Installation and Setup

### Method 1: Docker (Recommended)

**1. Configure environment variables**

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` file and add your MongoDB credentials:
```env
MONGODB_USERNAME=your-mongodb-username
MONGODB_PASSWORD=your-mongodb-password
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**2. Run with Docker Compose**

```bash
# Start server in development mode (with hot reload)
docker compose up -d

# View logs
docker compose logs -f

# Stop server
docker compose down
```

**3. Test the server**

```bash
# Health check
curl http://localhost:3000/health

# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

**Docker Commands:**
```bash
# Rebuild container after code changes
docker compose up --build -d

# View container status
docker compose ps

# Enter container shell
docker compose exec server sh

# View real-time logs
docker compose logs -f server

# Restart server
docker compose restart server

# Stop and remove containers
docker compose down
```

### Method 2: Local Development (Without Docker)

**1. Install dependencies**

```bash
cd src/server
npm install
```

**2. Configure environment variables**

Create `.env` file:
```bash
cp .env.example .env
```

Edit the `.env` file:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Atlas (connection string copied from above)
MONGODB_USERNAME=your-mongodb-username
MONGODB_PASSWORD=your-mongodb-password
MONGODB_URI=mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@pocket-ai-db.labcmhf.mongodb.net/?appName=pocket-ai-db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_ISSUER=pocket-ai-server
JWT_AUDIENCE=pocket-ai-app

# Google OAuth (configure later)
# I am going to add this feature later
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:19000
```

**3. Run server**

Development mode (nodemon - auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

When the server runs successfully:
```
🚀 Server is running on port 3000
📝 Environment: development
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

### 4. Health Check

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "message": "Pocket AI Server is running"
}
```

## 📡 API Endpoints

### Public Endpoints (No Authentication Required)

#### 1. Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Password Requirements:**
- Minimum 10 characters
- At least 1 uppercase letter
- At least 1 special character

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "createdAt": "2025-11-13T12:00:00.000Z"
    }
  }
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "lastLogin": "2025-11-13T12:00:00.000Z"
    }
  }
}
```

#### 3. Google Login
```http
GET /api/auth/google
```

When accessed from a browser, it redirects to the Google login page.

### Protected Endpoints (JWT Token Required)

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### 4. Verify Token
```http
GET /api/auth/verify
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com"
    }
  }
}
```

#### 5. Get Current User
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### 6. Logout
```http
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 🔑 JWT Token Structure

The generated JWT token includes the following payload:

```json
{
  "iss": "pocket-ai-server",
  "aud": "pocket-ai-app",
  "oid": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "iat": 1699876543,
  "exp": 1700481343
}
```

- `iss` (issuer): Token issuer
- `aud` (audience): Token audience
- `oid` (object ID): User MongoDB ObjectID
- `email`: User email
- `iat` (issued at): Issue time
- `exp` (expiration): Expiration time (default 7 days)

## 🧪 Testing

### cURL Examples

**1. Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

**3. Get user info with token:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🐳 Docker Architecture

### Development Setup

The project uses Docker for consistent development environment:

- **Dockerfile.dev**: Development image with nodemon for hot reload
- **Dockerfile**: Production image with optimized build
- **docker-compose.yml**: Orchestrates the server container

### Files Structure
```
src/server/
├── Dockerfile              # Production image
├── Dockerfile.dev          # Development image
├── docker-compose.yml      # Docker Compose configuration
├── .dockerignore          # Files to exclude from Docker build
└── .env                   # Environment variables (not in git)
```

## 🏫 Deploy to SSH Server

### 1. Connect to SSH Server
```bash
ssh username@server-address
```

### 2. Check Node.js Version
```bash
node -v
npm -v
```

If Node.js is not installed, install with nvm:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
```

### 3. Copy Project
```bash
# Clone with git
git clone <repository-url>
cd pocket-ai/src/server

# Or transfer files with scp
scp -r src/server username@server:/path/to/destination
```

### 4. Configure Environment Variables
```bash
nano .env
# Enter production settings and save
```

### 5. Run in Background with PM2
```bash
npm install -g pm2
pm2 start src/index.js --name pocket-ai-server
pm2 save
pm2 startup
```

### 6. Check Port and Firewall
```bash
# Check if port is open
netstat -tuln | grep 3000

# Configure firewall if needed (requires admin privileges)
sudo ufw allow 3000
```

## 📁 Project Structure

```
src/server/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   ├── jwt.js             # JWT configuration
│   │   └── passport.js        # Google OAuth configuration
│   ├── controllers/
│   │   └── authController.js  # Authentication logic
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── validation.js      # Input validation
│   ├── models/
│   │   └── User.js            # User schema
│   ├── routes/
│   │   └── authRoutes.js      # API routes
│   ├── utils/
│   │   └── validators.js      # Utility functions
│   └── index.js               # Server entry point
├── .env.example               # Environment variables example
├── .gitignore
├── package.json
├── Dockerfile                 # Production Docker image
├── Dockerfile.dev            # Development Docker image
├── docker-compose.yml        # Docker Compose configuration
└── README.md
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
❌ MongoDB Connection Error: ...
```
- Check `MONGODB_USERNAME` and `MONGODB_PASSWORD` in `.env` file
- Verify IP whitelist in MongoDB Atlas
- If username/password contains special characters, they need to be URL encoded

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
```bash
# Find and kill process using the port
lsof -ti:3000 | xargs kill -9

# For Docker
docker compose down
```

### JWT Token Error
- Verify `JWT_SECRET` is configured
- Check if frontend is sending token correctly (`Authorization: Bearer <token>`)

### Docker Container Won't Start
```bash
# View detailed logs
docker compose logs server

# Rebuild container completely
docker compose down
docker compose up --build -d

# Check if .env file exists
ls -la .env
```

## 📝 Next Steps

- [ ] Create MongoDB Atlas account and configure cluster
- [ ] Configure `.env` file
- [ ] Test server locally or with Docker
- [ ] Create Google OAuth client ID
- [ ] Integrate with frontend
- [ ] Deploy to SSH server
