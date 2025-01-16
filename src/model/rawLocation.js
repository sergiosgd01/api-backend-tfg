const mongoose = require('mongoose');

const rawLocationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  accuracy: { type: Number, required: false },
  timestamp: { type: Date, required: true },
  code: { type: Number, required: true },
  deviceID: { type: String, required: true, index: true },
  processed: { type: Boolean, default: false },
  errorCode: { type: Number, default: 0 },
  reason: { type: String, default: null } 
});

module.exports = mongoose.model('RawLocation', rawLocationSchema);
