const mongoose = require('mongoose');

const platformSettingSchema = new mongoose.Schema({
  platformName: { type: String, trim: true, default: 'GhostMode' },
  defaultTheme: { type: String, enum: ['light', 'dark'], default: 'light' },
  maxMessagesPerDay: { type: Number, default: 25, min: 1 },
  spamDetectionEnabled: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  autoDeleteFailedMessages: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlatformSetting', platformSettingSchema);
