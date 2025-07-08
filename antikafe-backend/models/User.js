const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:  { type: String, required: true },           // Отображаемое имя
  login:     { type: String, required: true },           // Уникальный логин внутри компании
  email:     { type: String },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
