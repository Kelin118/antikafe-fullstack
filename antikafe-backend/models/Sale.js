const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  soldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  soldAt: { type: Date, default: Date.now },
  groupId: String
});

module.exports = mongoose.model('Sale', saleSchema);
