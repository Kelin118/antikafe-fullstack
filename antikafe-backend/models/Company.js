const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name:   { type: String, required: true },
  login:  { type: String, required: true, unique: true }, // Уникальный логин компании
  email:  { type: String },
  phone:  { type: String },
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
