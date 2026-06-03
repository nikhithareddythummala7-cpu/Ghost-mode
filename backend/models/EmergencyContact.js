const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  relationship: { type: String, required: true, trim: true }
});

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
