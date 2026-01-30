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

  /**
   * Set authentication from stored cookie
   * @param {string} cookie - Milkshake cookie string
   */
  setAuth(cookie) {
    this.cookie = cookie;
  }

  /**
   * Make authenticated API request
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body (optional)
   * @returns {Promise<Object>} API response
   */
  async request(method, endpoint, data = null) {
    try {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (this.cookie) {
        config.headers['Cookie'] = this.cookie;
      }

      if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
        config.data = data;
      }

      const response = await axios(config);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Milkshake API ${method} ${endpoint} error:`, error.message);
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        details: error.response?.data,
      };
    }
  }

  // ==================== Tasks API ====================

  /**
   * Get tasks list
   * @param {Object} params - Query parameters (assignedUserId, etc.)
   */
  async getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/v1/tasks${query ? `?${query}` : ''}`);
  }

  /**
   * Get task by ID
   * @param {number} id - Task ID
   */
  async getTask(id) {
    return this.request('GET', `/v1/tasks/${id}`);
  }

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   */
  async createTask(taskData) {
    return this.request('POST', '/v1/tasks', taskData);
  }

  /**
   * Update a task
   * @param {number} id - Task ID
   * @param {Object} taskData - Updated task data
   */
  async updateTask(id, taskData) {
    return this.request('PATCH', `/v1/tasks/${id}`, taskData);
  }

  /**
   * Delete a task
   * @param {number} id - Task ID
   */
  async deleteTask(id) {
    return this.request('DELETE', `/v1/tasks/${id}`);
  }

  // ==================== Notes API ====================

  /**
   * Create a new note
   * @param {Object} noteData - Note data
   */
  async createNote(noteData) {
    return this.request('POST', '/v1/notes', noteData);
  }

  // ==================== Animals API ====================

  /**
   * Get animal by ID
   * @param {number} id - Animal ID
   */
  async getAnimal(id) {
    return this.request('GET', `/v1/animals/${id}`);
  }

  /**
   * Get animal ID by primary tag (Capstone endpoint)
   * @param {string} primaryTag - Animal's primary tag
   */
  async getAnimalByTag(primaryTag) {
    return this.request('GET', `/capstone/animals/by-reference/${encodeURIComponent(primaryTag)}`);
  }

  /**
   * Create a new animal
   * @param {Object} animalData - Animal data
   */
  async createAnimal(animalData) {
    return this.request('POST', '/v1/animals', animalData);
  }

  /**
   * Update an animal
   * @param {number} id - Animal ID
   * @param {Object} animalData - Updated animal data
   */
  async updateAnimal(id, animalData) {
    return this.request('PATCH', `/v1/animals/${id}`, animalData);
  }

  // ==================== Animal Events API ====================

  /**
   * Get animal events
   * @param {Object} params - Query parameters (dateStart, dateEnd, animalId, animalEventTypeIds)
   */
  async getAnimalEvents(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/v1/animal-events${query ? `?${query}` : ''}`);
  }

  /**
   * Create animal event(s)
   * @param {Object} eventData - Event data (animalIds is an array)
   */
  async createAnimalEvent(eventData) {
    return this.request('POST', '/v1/animal-events', eventData);
  }

  /**
   * Delete an animal event
   * @param {number} id - Event ID
   */
  async deleteAnimalEvent(id) {
    return this.request('DELETE', `/v1/animal-events/${id}`);
  }

  // ==================== Users API ====================

  /**
   * Get users list
   * @param {Object} params - Query parameters
   */
  async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/v1/users${query ? `?${query}` : ''}`);
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   */
  async getUser(id) {
    return this.request('GET', `/v1/users/${id}`);
  }

  /**
   * Get current session info
   * @param {string} id - Session ID
   */
  async getSession(id) {
    return this.request('GET', `/v1/auth/${id}`);
  }
}

module.exports = MilkshakeClient;
