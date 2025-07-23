const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  login: { type: String, required: true, unique: true }, // Уникальный логин компании
  email: { type: String },
  phone: { type: String },

  // 🆕 Добавляем поле для хранения последних номиналов
  lastDenominations: {
    type: Map,
    of: Number,
    default: {},
  }

}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
