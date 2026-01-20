
// REMEMBER THE ROUNF-ROBIN SYSTEM for MATCHES

const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  date: { type: Date, default: null }, 
  played: { type: Boolean, default: false }, // To track if the game is finished
  round: {type: Number, required: true},
  field: {type: mongoose.Schema.Types.ObjectId, ref: 'Field', default: null}
});

module.exports = mongoose.model('Match', MatchSchema);