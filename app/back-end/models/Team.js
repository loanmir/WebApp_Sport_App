const mongoose = require('mongoose');

// Sub-schema for Players (embedded inside the Team)
const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  number: { type: Number } // Optional jersey number
});

// Main Team Schema
const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  // Link to the Tournament this team belongs to
  tournament: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tournament', 
    required: false 
  },
  
  // Array of player objects
  players: [PlayerSchema] 
});

module.exports = mongoose.model('Team', TeamSchema);