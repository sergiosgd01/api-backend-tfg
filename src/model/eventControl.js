const mongoose = require('mongoose');

const eventControlSchema = new mongoose.Schema({
  eventCode: {
    type: Number,
    unique: true,
    required: true,
    min: 1,
    max: 99999,
  },
  isTrackingEnabled: {
    type: Boolean,
    default: false,
  },
  updateFrequency: {
    type: Number, // Milisegundos
    required: true,
    default: 60000, // Por defecto 60 segundos
  },
  accuracy: {
    type: Number,
    default: 30, // Por defecto 30 metros
  },
  lastUpdated: {
    type: Date,
    default: Date.now, // Fecha de la última modificación
  },
});

const EventControl = mongoose.model('EventControl', eventControlSchema);

module.exports = EventControl;
