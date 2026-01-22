# Test Files

This directory contains test scripts for the PocketAI server.

## Test Files

### test-api.js
Tests the Log API endpoints without requiring full server setup.
- Module loading verification
- MilkshakeClient API methods check
- Log model schema validation
- User model schema validation

```bash
node tests/test-api.js
```

### test-milkshake.js
Basic Milkshake API authentication and endpoint tests.
- Authentication test
- Session verification
- Users list retrieval
- Tasks list retrieval

```bash
node tests/test-milkshake.js
```

### test-milkshake-full.js
Extended Milkshake API tests (attempted CRUD operations).
Note: Some operations may fail due to API requirements.

```bash
node tests/test-milkshake-full.js
```

### test-milkshake-api.js
Comprehensive Milkshake API integration test.
- User authentication
- Session management
- Task CRUD operations (Create, Read, Update, Delete)
- Animal events retrieval
- Users list retrieval

```bash
node tests/test-milkshake-api.js
```

## Running Tests

Make sure the server environment is properly configured:

1. Set up `.env` file with MongoDB credentials
2. Install dependencies: `npm install`
3. Run individual test files from the server root directory

Example:
```bash
cd src/server
node tests/test-milkshake-api.js
```

## Test Credentials

Tests use the Milkshake API credentials configured in the test files.
For production testing, update credentials in the respective test files.
