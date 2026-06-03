const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, profile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/profile', protect, profile);

module.exports = router;
