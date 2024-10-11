const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
  code: Number,
  latitude: Number,
  longitude: Number,
  altitude: Number,
  accuracy: Number,
  timestamp: Date,
  deviceID: String,
  name: String,
  dorsal: Number,
  color: String
})

const Location = mongoose.model('Location', locationSchema)

module.exports = Location;