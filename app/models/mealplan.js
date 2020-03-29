const mongoose = require('mongoose')

const mealplanSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Mealplan', mealplanSchema)
