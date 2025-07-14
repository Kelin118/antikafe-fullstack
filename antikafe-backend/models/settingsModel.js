// models/settingsModel.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    unique: true
  },
  name: String,
  workingHours: String,
  language: {
    type: String,
    enum: ['ru', 'kz', 'en'],
    default: 'ru'
  },
  notifications: Boolean,
  autosave: Boolean,
  logoUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
