const mongoose = require('mongoose')

const serviceTypeSchema = new mongoose.Schema({
  id: Number,
  name: String,
  image: String
})

const ServiceType = mongoose.model('ServiceType', serviceTypeSchema)

module.exports = ServiceType;