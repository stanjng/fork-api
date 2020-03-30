// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose recipes model
const Recipe = require('../models/recipe.js')
const Mealplan = require('../models/mealplan.js')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// // this is middleware that will remove blank fields from `req.body`, e.g.
// // { recipe: { title: '', text: 'foo' } } -> { recipe: { text: 'foo' } }
// const removeBlanks = require('../../lib/remove_blank_fields')
// // passing this as a second argument to `router.<verb>` will make it
// // so that a token MUST be passed for that route to be available
// // it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX all recipes of a mealplan
router.get('/mealplans/:id/recipes', requireToken, (req, res, next) => {
  Mealplan.findById(req.params.id)
    .populate('recipes')
    .then(mealplan => mealplan.recipes.map(r => r.toObject()))
    .then(recipes => res.status(200).json({
      recipes
    }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// // SHOW
// // GET /mealplans/:id/recipes/
// router.get('/mealplans/:id/recipes/:id', requireToken, (req, res, next) => {
//   // req.params.id will be set based on the `:id` in the route
//   Recipe.findById(req.params.id)
//     .then(handle404)
//     // if `findById` is succesful, respond with 200 and "topic" JSON
//     .then(topic => res.status(200).json({ topic: topic.toObject() }))
//     // if an error occurs, pass it to the handler
//     .catch(next)
// })

// SHOW single recipe from a mealplan
router.get('/mealplans/:id/recipes/:rid', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Recipe.findById(req.params.rid)
    .then(recipe => res.status(200).json({ recipe: recipe }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /mealplans/:id/recipes
router.post('/mealplans/:id/recipes', requireToken, (req, res, next) => {
  // assigns the user id to the owner property within recipe, so recipe will be
  // assigned to the proper user account
  req.body.owner = req.user.id

  // non-promise chain recipe store
  let tempRecipe
  Recipe.create(req.body)
    // take created recipe that has data + mealplan id
    .then(recipe => {
      // store created recipe in temp variable
      tempRecipe = recipe
      // return specific mealplan recipe belongs to using mealplan_id
      return Mealplan.findById(req.params.id).populate('recipes')
    })
    //
    // take the returned corresponding mealplan and push temp created recipe into recipes array
    .then(mealplan => {
      // push into recipes array of corresponding mealplan
      mealplan.recipes.push(tempRecipe)
      // save mealplan
      return mealplan.save()
    })
    // respond to succesful `create` with status 201 and JSON of new "question"
    .then(mealplan => {
      res.status(201).json({ mealplan: mealplan.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// DELETE /mealplans/:id/recipes/5a7db6c74d55bc51bdf39793
router.delete('/mealplans/:id/recipes/:rid', requireToken, (req, res, next) => {
  Recipe.findById(req.params.rid)
    .then(handle404)
    .then(recipe => {
      // throw an error if current user doesn't own `recipe`
      requireOwnership(req, recipe)
      // delete the recipe ONLY IF the above didn't throw
      recipe.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
