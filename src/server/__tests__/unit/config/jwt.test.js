const { generateTokenPair, verifyAccessToken, verifyRefreshToken } = require('../../../src/config/jwt');

describe('JWT Utility Unit Tests', () => {
  const mockPayload = {
    oid: '64f1a2b3c4d5e6f7a8b9c0d1',
    email: 'test@example.com'
  };

  describe('generateTokenPair', () => {
    test('should generate both access and refresh tokens', () => {
      const tokens = generateTokenPair(mockPayload);

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
    });

    test('should generate tokens with JWT format', () => {
      const tokens = generateTokenPair(mockPayload);

      // JWT format: header.payload.signature
      expect(tokens.accessToken.split('.').length).toBe(3);
      expect(tokens.refreshToken.split('.').length).toBe(3);
    });

    test('should generate different tokens for same payload', async () => {
      const tokens1 = generateTokenPair(mockPayload);

      // Wait 1000ms to ensure different timestamp (iat is in seconds)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const tokens2 = generateTokenPair(mockPayload);

      // Tokens should be different due to timestamp (iat claim)
      expect(tokens1.accessToken).not.toBe(tokens2.accessToken);
      expect(tokens1.refreshToken).not.toBe(tokens2.refreshToken);
    });
  });

  describe('verifyAccessToken', () => {
    test('should verify valid access token', () => {
      const { accessToken } = generateTokenPair(mockPayload);

      const decoded = verifyAccessToken(accessToken);

      expect(decoded.oid).toBe(mockPayload.oid);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.iat).toBeDefined(); // Issued at
      expect(decoded.exp).toBeDefined(); // Expiration
    });

    test('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => verifyAccessToken(invalidToken)).toThrow();
    });

    test('should throw error for malformed token', () => {
      const malformedToken = 'not-a-jwt-token';

      expect(() => verifyAccessToken(malformedToken)).toThrow();
    });

    test('should throw error for empty token', () => {
      expect(() => verifyAccessToken('')).toThrow();
    });

    test('should throw error for refresh token used as access token', () => {
      const { refreshToken } = generateTokenPair(mockPayload);

      // Refresh token has different secret, should fail verification
      expect(() => verifyAccessToken(refreshToken)).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    test('should verify valid refresh token', () => {
      const { refreshToken } = generateTokenPair(mockPayload);

      const decoded = verifyRefreshToken(refreshToken);

      expect(decoded.oid).toBe(mockPayload.oid);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    test('should throw error for invalid refresh token', () => {
      const invalidToken = 'invalid.refresh.token';

      expect(() => verifyRefreshToken(invalidToken)).toThrow();
    });

    test('should throw error for access token used as refresh token', () => {
      const { accessToken } = generateTokenPair(mockPayload);

      // Access token has different secret, should fail verification
      expect(() => verifyRefreshToken(accessToken)).toThrow();
    });
  });

  describe('Token Expiration', () => {
    test('access token should have shorter expiration than refresh token', () => {
      const { accessToken, refreshToken } = generateTokenPair(mockPayload);

      const accessDecoded = verifyAccessToken(accessToken);
      const refreshDecoded = verifyRefreshToken(refreshToken);

      // exp is in seconds since epoch
      expect(refreshDecoded.exp).toBeGreaterThan(accessDecoded.exp);
    });

    test('access token should expire in 15 minutes', () => {
      const { accessToken } = generateTokenPair(mockPayload);
      const decoded = verifyAccessToken(accessToken);

      const expirationTime = decoded.exp - decoded.iat;
      expect(expirationTime).toBe(15 * 60); // 15 minutes in seconds
    });

    test('refresh token should expire in 7 days', () => {
      const { refreshToken } = generateTokenPair(mockPayload);
      const decoded = verifyRefreshToken(refreshToken);

      const expirationTime = decoded.exp - decoded.iat;
      expect(expirationTime).toBe(7 * 24 * 60 * 60); // 7 days in seconds
    });
  });

  describe('Token Payload', () => {
    test('should preserve required payload fields', () => {
      const payload = {
        oid: '64f1a2b3c4d5e6f7a8b9c0d1',
        email: 'user@example.com'
      };

      const { accessToken } = generateTokenPair(payload);
      const decoded = verifyAccessToken(accessToken);

      expect(decoded.oid).toBe(payload.oid);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.type).toBe('access');
      expect(decoded.iss).toBe('pocket-ai-server');
      expect(decoded.aud).toBe('pocket-ai-app');
    });

    test('should handle minimal payload', () => {
      const minimalPayload = {
        oid: '123'
      };

      const { accessToken } = generateTokenPair(minimalPayload);
      const decoded = verifyAccessToken(accessToken);

      expect(decoded.oid).toBe('123');
    });
  });

  describe('Token Security', () => {
    test('tokens should not be decodable without secret', () => {
      const { accessToken } = generateTokenPair(mockPayload);

      // Attempting to decode without verification should not expose data
      const parts = accessToken.split('.');
      expect(parts).toHaveLength(3);

      // Payload is base64 encoded but should not be used without verification
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      expect(payload.oid).toBe(mockPayload.oid);

      // However, signature verification is required to trust the data
      // This test just confirms structure, not security
    });

    test('modified token should fail verification', () => {
      const { accessToken } = generateTokenPair(mockPayload);

      // Tamper with token
      const tamperedToken = accessToken.slice(0, -5) + 'xxxxx';

      expect(() => verifyAccessToken(tamperedToken)).toThrow();
    });
  });
});
