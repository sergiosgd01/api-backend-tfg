const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  code: Number,
  name: String,
  province: String,
  time_distance: String,
  multiuser: Number,
  status: Number,
  cancelledInfo: String,
  startDate: Date,
  endDate: Date,
  image: String,
  qrCode: String,
  organizationCode: Number
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event;