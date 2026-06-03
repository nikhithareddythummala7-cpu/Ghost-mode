const express = require('express');
const router = express.Router();
const {
  getUsers,
  changeUserStatus,
  deleteUser,
  getCapsules,
  markCapsuleSuspicious,
  deleteCapsule,
  getMessages,
  reviewMessage,
  deleteMessage,
  getVault,
  deleteVaultItem,
  getContacts,
  deleteContact,
  getStats,
  getAnalytics,
  getPlatformSettings,
  updatePlatformSettings,
  getActivity
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect);
router.use(adminOnly);
router.get('/stats', getStats);
router.get('/analytics', getAnalytics);
router.get('/activity', getActivity);
router.get('/settings', getPlatformSettings);
router.put('/settings', updatePlatformSettings);
router.get('/users', getUsers);
router.put('/users/:id/status', changeUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/capsules', getCapsules);
router.put('/capsules/:id/suspicious', markCapsuleSuspicious);
router.delete('/capsules/:id', deleteCapsule);
router.get('/messages', getMessages);
router.put('/messages/:id/review', reviewMessage);
router.delete('/messages/:id', deleteMessage);
router.get('/vault', getVault);
router.delete('/vault/:id', deleteVaultItem);
router.get('/contacts', getContacts);
router.delete('/contacts/:id', deleteContact);

module.exports = router;
