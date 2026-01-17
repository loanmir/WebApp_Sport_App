const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  name: { type: String, required: true },

  sport: { 
    type: String, 
    enum: ['Football', 'Volleyball', 'Basketball'], 
    required: true 
  },

  address: { type: String, required: true },
  
  bookableSlots:[{
    id: Number,
    time: String,
  }]
});

module.exports = mongoose.model('Field', FieldSchema);