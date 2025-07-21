const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  description: { type: String, default: '' },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductGroup' },
  companyId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Company' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
