const mongoose = require('mongoose');

const scheduledMessageSchema = new mongoose.Schema({
  recipientEmail: { type: String, required: true, trim: true, lowercase: true },
  recipientCount: { type: Number, default: 1 },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'delivered', 'failed', 'blocked'], default: 'pending' },
  reviewStatus: { type: String, enum: ['approved', 'pending_review', 'blocked'], default: 'approved' },
  isFlagged: { type: Boolean, default: false },
  spamScore: { type: Number, default: 0 },
  flagReason: { type: String, default: '' },
  attachment: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScheduledMessage', scheduledMessageSchema);
