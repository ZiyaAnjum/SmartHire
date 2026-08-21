const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, signupSchema, loginSchema, updateProfileSchema } = require('../middleware/validation');

// Public auth routes
router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);

// Private profile routes
router.get('/me', protect, getMe);
router.patch('/me', protect, validate(updateProfileSchema), updateMe);

module.exports = router;
