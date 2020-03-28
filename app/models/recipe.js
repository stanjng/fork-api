const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
  mealPlanId: {
    type: Number,
    require: true
  },
  mealType: {
    type: String,
    require: true
  },
  recipeTitle: {
    type: String,
    require: true
  },
  recipeAuthor: {
    type: String
  },
  recipeImage: {
    type: String,
    require: true
  },
  recipeSummary: {
    type: String,
    require: true
  },
  recipeSteps: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Step'
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Recipe', recipeSchema)
