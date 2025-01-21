const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
  code: Number,
  deviceID: { type: String, required: true, index: true },
  latitude: Number,
  longitude: Number,
  accuracy: Number,
  timestamp: Date,
})

const Location = mongoose.model('Location', locationSchema)

module.exports = Location;