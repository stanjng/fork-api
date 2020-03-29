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
  recipeAuthor: String,
  recipeImage: {
    type: String,
    require: true
  },
  recipeSummary: {
    type: String,
    require: true
  },
  recipeSteps: [{
    stepNumber: {
      type: Number,
      required: true
    },
    stepText: {
      type: String,
      required: true
    }
  }],
  recipeIngredients: [{
    ingredientName: {
      type: String,
      required: true
    },
    ingredientAmount: {
      type: Number,
      required: true
    },
    ingredientUnit: {
      type: String,
      required: true
    }
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
