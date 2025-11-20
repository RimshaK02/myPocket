/**
 * Password validation function
 * Rules: Minimum 10 characters, at least 1 uppercase letter, at least 1 special character
 * @param {String} password
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    return { isValid: false, errors: ['Password is required'] };
  }

  // Minimum 10 characters
  if (password.length < 10) {
    errors.push('Password must be at least 10 characters long');
  }

  // At least 1 uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // At least 1 special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Email validation function
 * @param {String} email
 * @returns {Boolean}
 */
const validateEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

module.exports = {
  validatePassword,
  validateEmail
};
