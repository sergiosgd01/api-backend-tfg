const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 999
  },
  name: {
    type: String,
    required: true
  }
});

const Organization = mongoose.model('Organization', organizationSchema)

module.exports = Organization;