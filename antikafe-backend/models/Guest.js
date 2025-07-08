const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: String,
  groupId: String, // 👈 новое поле
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Guest', guestSchema);
