import { body, validationResult } from 'express-validator';

export const validateRegistration = [
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  handleValidationErrors
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
  handleValidationErrors
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};
