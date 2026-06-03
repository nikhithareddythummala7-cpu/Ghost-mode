const mongoose = require('mongoose');

const timeCapsuleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  unlockDate: { type: Date, required: true },
  status: { type: String, enum: ['locked', 'unlocked'], default: 'locked' },
  visibility: { type: String, enum: ['private', 'public'], default: 'private' },
  attachments: [{ type: String }],
  isSuspicious: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TimeCapsule', timeCapsuleSchema);
