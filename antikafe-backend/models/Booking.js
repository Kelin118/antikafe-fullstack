const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  room: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  groupId: { type: String, default: null },
  guestNames: [String],
  status: {
    type: String,
    enum: ['free', 'booked', 'finished', 'paid'],
    default: 'booked'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
