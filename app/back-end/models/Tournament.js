const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },                  
  sport: { 
    type: String, 
    required: true,
    enum: ['Football', 'Volleyball', 'Basketball'] 
},

  startDate: { type: Date, required: true },               
  maxTeams: { type: Number, required: true },              
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  status: { 
    type: String, 
    enum: ['Open', 'Active', 'Completed'], 
    default: 'Open' 
}
});

module.exports = mongoose.model('Tournament', TournamentSchema);