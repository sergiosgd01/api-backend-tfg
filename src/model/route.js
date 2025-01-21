const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  code: Number,
  deviceID: { type: String, required: true, index: true },
  latitude: Number,
  longitude: Number,
  visited: {
    type: Boolean,
    default: false, 
  },
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
