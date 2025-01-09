const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema({
  type: {
    type: Number,
    unique: true, 
    required: true, 
    min: 1,
    max: 99
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true, 
  },
});

const ServiceType = mongoose.model('ServiceType', serviceTypeSchema);

module.exports = ServiceType;
