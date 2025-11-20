const { body, validationResult } = require('express-validator');
const { validatePassword } = require('../utils/validators');

/**
 * Registration validation rules
 */
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .custom((value) => {
      const { isValid, errors } = validatePassword(value);
      if (!isValid) {
        throw new Error(errors.join(', '));
      }
      return true;
    })
];

/**
 * Login validation rules
 */
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Validation result checker middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  validate
};
