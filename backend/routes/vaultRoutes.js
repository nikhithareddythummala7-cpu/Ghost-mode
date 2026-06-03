const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getVault, createVaultItem, deleteVaultItem } = require('../controllers/vaultController');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });
router.use(protect);
router.get('/', getVault);
router.post('/', upload.single('file'), createVaultItem);
router.delete('/:id', deleteVaultItem);

module.exports = router;
