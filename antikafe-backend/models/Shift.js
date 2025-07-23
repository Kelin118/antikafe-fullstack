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

  // 🆕 Новые поля
  cashWithdrawal: {
    type: Number,
    default: 0,
  },
  cardAmountCalculated: {
    type: Number,
    default: 0,
  },
  cardAmountEntered: {
    type: Number,
    default: 0,
  },
  cardMismatch: {
    type: Number,
    default: 0,
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
