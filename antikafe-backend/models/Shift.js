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
  openedAt: {
    type: Date,
    default: Date.now,
  },
  closingAmount: Number,
  closedAt: Date,
  isOpen: {
    type: Boolean,
    default: true,
  }
});

module.exports = mongoose.model('Shift', shiftSchema);
