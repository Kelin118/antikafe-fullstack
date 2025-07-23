const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  cashierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  openingAmount: {
    type: Number,
    required: true,
  },
  openingDenominations: {
    type: Map,
    of: Number,
    default: {}
  },
  closingAmount: Number,
  closingDenominations: {
    type: Map,
    of: Number,
    default: {}
  },
  openedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: Date,
  isOpen: {
    type: Boolean,
    default: true,
  }
});

module.exports = mongoose.model('Shift', shiftSchema);
