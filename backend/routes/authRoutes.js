const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// Route for registering a new user
router.post('/signup', signup);

// Route for authenticating a user
router.post('/login', login);

module.exports = router;
