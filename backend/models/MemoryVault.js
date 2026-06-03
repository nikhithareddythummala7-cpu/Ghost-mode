const mongoose = require('mongoose');

const memoryVaultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['photo', 'video', 'document', 'note'], required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  fileSize: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MemoryVault', memoryVaultSchema);
