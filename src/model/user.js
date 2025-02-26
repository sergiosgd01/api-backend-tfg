const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  adminOf: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  }]
})

const User = mongoose.model('User', userSchema)

module.exports = User;