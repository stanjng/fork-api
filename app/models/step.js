const mongoose = require('mongoose')

const stepSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true
  },
  stepText: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Step', stepSchema)
