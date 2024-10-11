const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
  code: Number,
  latitude: Number,
  longitude: Number,
})

const Route = mongoose.model('Route', routeSchema)

module.exports = Route;