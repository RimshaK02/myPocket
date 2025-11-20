const axios = require('axios');
const FormData = require('form-data');

/**
 * Milkshake API Client
 * Base URL: https://api.dev.mshake.app/
 */
class MilkshakeClient {
  constructor() {
    this.baseURL = 'https://api.dev.mshake.app';
    this.token = null;
    this.cookie = null;
  }

  /**
   * Authenticate with Milkshake API
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication result with token and cookie
   */
  async authenticate(email, password) {
    try {
      // Create form-data
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      // Make authentication request
      const response = await axios.post(
        `${this.baseURL}/v1/auth`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          // Don't automatically follow redirects to get the cookie
          maxRedirects: 0,
          validateStatus: (status) => status < 400,
        }
      );

      // Extract cookie from response
      const cookies = response.headers['set-cookie'];
      if (cookies) {
        const milkshakeCookie = cookies.find(cookie => cookie.startsWith('milkshake='));
        if (milkshakeCookie) {
          this.cookie = milkshakeCookie.split(';')[0];
        }
      }

      // Extract X-Milkshake-Token from headers or response data
      this.token = response.headers['x-milkshake-token'] || response.data?.token;

      return {
        success: true,
        token: this.token,
        cookie: this.cookie,
        data: response.data,
      };
    } catch (error) {
      console.error('Milkshake API authentication error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }

      return {
        success: false,
        error: error.message,
        details: error.response?.data,
      };
    }
  }

  /**
   * Get current authentication status
   * @returns {Object} Current token and cookie
   */
  getAuthStatus() {
    return {
      token: this.token,
      cookie: this.cookie,
      isAuthenticated: !!(this.token || this.cookie),
    };
  }

  /**
   * Clear authentication
   */
  clearAuth() {
    this.token = null;
    this.cookie = null;
  }
}

module.exports = MilkshakeClient;
