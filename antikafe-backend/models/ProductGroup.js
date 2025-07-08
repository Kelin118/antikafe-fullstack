const mongoose = require('mongoose');

const productGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProductGroup', productGroupSchema);
