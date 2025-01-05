const mongoose = require('mongoose');

const rawLocationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  accuracy: { type: Number, required: false },
  timestamp: { type: Date, required: true },
  code: { type: Number, required: true },
  processed: { type: Boolean, default: false },
  reason: { type: String, default: null } // Campo adicional para la razón
});

module.exports = mongoose.model('RawLocation', rawLocationSchema);
