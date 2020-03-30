// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose mealplans model
const Mealplan = require('../models/mealplan.js')
// const Recipe = require('../models/recipe.js')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { recipe: { title: '', text: 'foo' } } -> { recipe: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /mealplans
router.get('/mealplans', requireToken, (req, res, next) => {
  Mealplan.find()
    .populate('recipes')
    .then(mealplans => {
      return mealplans.map(mealplan => mealplan.toObject())
    })
    .then(mealplans => res.status(200).json({
      mealplans
    }))
    // if an error occurs, pass it to the handler
    .catch(next)
}
)

// SHOW
// GET /mealplans/:id
router.get('/mealplans/:id', requireToken, (req, res, next) => {
  console.log(req.query)
  // req.params.id will be set based on the `:id` in the route
  Mealplan.findById(req.params.id)
    .populate('recipes')
    .then(mealplans => res.status(200).json({ mealplans: mealplans }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /mealplans
router.post('/mealplans', requireToken, (req, res, next) => {
  // assigns the user id to the owner property within recipe, so recipe will be
  // assigned to the proper user account
  req.body.owner = req.user.id

  Mealplan.create(req.body)
    // respond to succesful `create` with status 201 and JSON of new "recipe"
    .then(mealplan => {
      res.status(201).json({ mealplan: mealplan.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /mealplans/5a7db6c74d55bc51bdf39793
router.patch('/mealplans/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.owner

  Mealplan.findById(req.params.id)
    .then(handle404)
    .then(mealplan => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, mealplan)

      // pass the result of Mongoose's `.update` to the next `.then`
      return mealplan.updateOne(req.body.mealplan)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DELETE /mealplans/:id/recipes/5a7db6c74d55bc51bdf39793
router.delete('/mealplans/:id', requireToken, (req, res, next) => {
  Mealplan.findById(req.params.id)
    .then(handle404)
    .then(mealplan => {
      // throw an error if current user doesn't own `mealplan`
      requireOwnership(req, mealplan)
      // delete the mealplan ONLY IF the above didn't throw
      mealplan.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
