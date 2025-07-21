const mongoose = require('mongoose');

const productGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  companyId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Company' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProductGroup', productGroupSchema);
