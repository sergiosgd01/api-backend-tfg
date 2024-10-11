const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  code: Number,
  latitude: Number,
  longitude: Number,
  type: Number
})

const Service = mongoose.model('Service', serviceSchema)

module.exports = Service;