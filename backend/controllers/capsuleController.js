const TimeCapsule = require('../models/TimeCapsule');
const { sendCapsuleUnlockNotification } = require('../services/emailService');

exports.getCapsules = async (req, res) => {
  const capsules = await TimeCapsule.find({ userId: req.user._id }).sort({ createdAt: -1 });
  const unlockedCapsules = capsules.filter((capsule) => capsule.unlockDate <= new Date() && capsule.status === 'locked');

  for (const capsule of unlockedCapsules) {
    try {
      capsule.status = 'unlocked';
      await capsule.save();
      await sendCapsuleUnlockNotification({ email: req.user.email, title: capsule.title });
    } catch (error) {
      console.error('Failed to unlock capsule notification:', error.message || error);
    }
  }

  res.json(capsules);
};

exports.createCapsule = async (req, res) => {
  const { title, message, unlockDate, visibility, attachments } = req.body;
  if (!title || !message || !unlockDate) {
    return res.status(400).json({ message: 'Title, message, and unlock date are required' });
  }
  const capsule = await TimeCapsule.create({
    title,
    message,
    unlockDate,
    visibility: visibility || 'private',
    attachments: attachments || [],
    userId: req.user._id,
    status: new Date(unlockDate) <= new Date() ? 'unlocked' : 'locked'
  });
  res.status(201).json(capsule);
};

exports.updateCapsule = async (req, res) => {
  const capsule = await TimeCapsule.findOne({ _id: req.params.id, userId: req.user._id });
  if (!capsule) {
    return res.status(404).json({ message: 'Time capsule not found' });
  }
  const { title, message, unlockDate, visibility, attachments } = req.body;
  if (title) capsule.title = title;
  if (message) capsule.message = message;
  if (unlockDate) capsule.unlockDate = unlockDate;
  if (visibility) capsule.visibility = visibility;
  if (attachments) capsule.attachments = attachments;
  capsule.status = new Date(capsule.unlockDate) <= new Date() ? 'unlocked' : 'locked';
  await capsule.save();
  res.json(capsule);
};

exports.deleteCapsule = async (req, res) => {
  const capsule = await TimeCapsule.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!capsule) {
    return res.status(404).json({ message: 'Time capsule not found' });
  }
  res.json({ message: 'Capsule deleted' });
};
