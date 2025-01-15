const mongoose = require('mongoose');

const eventControlSchema = new mongoose.Schema({
  eventCode: {
    type: Number,
    unique: true,
    required: true,
  },
  isTrackingEnabled: {
    type: Boolean,
    default: false,
  },
  updateFrequency: {
    type: Number, 
    required: true,
    default: 60000, 
  },
  accuracy: {
    type: Number,
    default: 30, 
  },
  lastUpdated: {
    type: Date,
    default: Date.now, 
  },
});

const EventControl = mongoose.model('EventControl', eventControlSchema);

module.exports = EventControl;
