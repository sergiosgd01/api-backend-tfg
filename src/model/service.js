const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  code: Number,
  deviceID: { type: String, required: true, index: true },
  latitude: Number,
  longitude: Number,
  type: Number
})

const Service = mongoose.model('Service', serviceSchema)

module.exports = Service;