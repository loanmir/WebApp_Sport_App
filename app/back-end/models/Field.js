const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  name: { type: String, required: true },

  sport: { 
    type: String, 
    enum: ['Football', 'Volleyball', 'Basketball'], 
    required: true 
  },

  address: { type: String, required: true },
  
  bookableSlots:{
    type: [String],
    required: true,
    default: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
  }
});

module.exports = mongoose.model('Field', FieldSchema);