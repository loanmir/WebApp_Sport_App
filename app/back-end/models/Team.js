// Defining the schema of the News collection in MongoDB (like a table in SQL)

const mongoose = require('mongoose');

const teamsSchema = new mongoose.Schema({
  title: String,
  slug: String,
  text: String,
  // date: 
});


module.exports = mongoose.model('Team', teamsSchema);