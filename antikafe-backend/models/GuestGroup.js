// ✅ models/GuestGroup.js
const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: String,
  products: [
    {
      name: String,
      price: Number
    }
  ]
}, { _id: false });

const guestGroupSchema = new mongoose.Schema({
  guests: [guestSchema],
  paymentType: { type: String, enum: ['cash', 'card', 'mixed'] },
  totalSum: Number,
  cashAmount: Number,
  cardAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GuestGroup', guestGroupSchema);
