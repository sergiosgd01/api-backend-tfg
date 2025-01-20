const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  code: Number,
  latitude: Number,
  longitude: Number,
  visited: {
    type: Boolean,
    default: false, 
  },
  deviceID: { type: String, required: true, index: true },
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
