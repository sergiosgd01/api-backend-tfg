const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  code: Number,
  name: String,
  postalCode: String,
  time: Number,
  status: Number,
  cancelledInfo: String,
  startDate: Date,
  endDate: Date,
  image: String,
  qrCode: String,
  icon: String,
  organizationCode: Number,
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event;