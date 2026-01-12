const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_username: {
    type: String,
    unique: true,
    required: true
  },
  user_password: {
    type: String,
    required: true
  },
  user_firstName:{
    type: String,
    required: true
  },
  user_surname:{
    type: String,
    required: true
  }
  // date: 
});

module.exports = mongoose.model('User', userSchema);