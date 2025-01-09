const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  code: {
    type: Number,
    unique: true,
    required: true, 
    min: 1,
    max: 99999, 
  },
  name: { type: String, required: true },
  postalCode: { type: String, required: true },
  time: { type: Number, required: true },
  status: { type: Number, default: 0 }, 
  cancelledInfo: { type: String, default: '' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  image: { type: String, default: '' },
  qrCode: { type: String, default: '' },
  icon: { type: String, default: '' },
  organizationCode: { type: Number, required: true },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
