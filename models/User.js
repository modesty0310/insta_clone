const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    maxlength: 50
  },
  password: {
    type: String,
    minLength: 5,
  },
  name: {
    type: String,
    maxlength: 50
  },
  birth: {
    type: String,
  },
  gender: {
    type: String
  },
  phoneNumber:{
    type: String,
  }
});

module.exports = mongoose.model('User', userSchema);