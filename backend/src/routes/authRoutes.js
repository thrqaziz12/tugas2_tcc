const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout  (wajib login dulu / butuh token valid)
router.post('/logout', verifyToken, logout);

module.exports = router;
