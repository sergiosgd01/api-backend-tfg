const mongoose = require('mongoose')

const serviceTypeSchema = new mongoose.Schema({
  type: Number,
  name: String,
  image: String
})

const ServiceType = mongoose.model('ServiceType', serviceTypeSchema)

module.exports = ServiceType;