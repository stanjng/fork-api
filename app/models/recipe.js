const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
  mealPlanId: {
    type: Number,
    require: true
  },
  recipeTitle: {
    type: String,
    require: true
  },
  recipeAuthor: {
    type: String,
    require: true
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
    ref: 'Step',
    required: true
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
