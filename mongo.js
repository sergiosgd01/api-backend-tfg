const mongoose = require('mongoose')
const { password } = require('./password'); 

const encodedPassword = encodeURIComponent(password);

const connectionString = `mongodb+srv://sergiosgd2001:${encodedPassword}@cluster.vqj6e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`

mongoose.connect(connectionString)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })