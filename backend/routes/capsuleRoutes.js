const express = require('express');
const router = express.Router();
const { getCapsules, createCapsule, updateCapsule, deleteCapsule } = require('../controllers/capsuleController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getCapsules);
router.post('/', createCapsule);
router.put('/:id', updateCapsule);
router.delete('/:id', deleteCapsule);

module.exports = router;
