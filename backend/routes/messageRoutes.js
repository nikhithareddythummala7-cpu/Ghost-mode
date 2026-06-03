const express = require('express');
const router = express.Router();
const messageLimiter = require('../middleware/messageLimiter');
const { getMessages, createMessage, updateMessage, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getMessages);
router.post('/', messageLimiter, createMessage);
router.put('/:id', updateMessage);
router.delete('/:id', deleteMessage);

module.exports = router;
