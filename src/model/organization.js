const mongoose = require('mongoose')

const organizationSchema = new mongoose.Schema({
  code: Number,
  name: String
})

const Organization = mongoose.model('Organization', organizationSchema)

module.exports = Organization;