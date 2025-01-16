const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
  code: Number,
  latitude: Number,
  longitude: Number,
  accuracy: Number,
  timestamp: Date,
  deviceID: { type: String, required: true, index: true },
})

const Location = mongoose.model('Location', locationSchema)

module.exports = Location;