// It links a User, a Field and a Date
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true }, // e.g., 2026-05-20
  timeSlot: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

// Optional: Prevent double booking at the database level
// This ensures no two bookings can exist for the same field, date, and slot
BookingSchema.index({ field: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', BookingSchema);