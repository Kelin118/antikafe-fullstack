// models/Role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permissions: [String], // например: ['edit_products', 'view_bookings']
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
});

module.exports = mongoose.model('Role', roleSchema);
