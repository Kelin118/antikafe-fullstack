const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // 👈
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Guest', guestSchema);
