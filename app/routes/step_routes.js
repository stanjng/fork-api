// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for steps
const Step = require('../models/step')

// // this is a collection of methods that help us detect situations when we need
// // to throw a custom error
// const customErrors = require('../../lib/custom_errors')
//
// // we'll use this function to send 404 when non-existant document is requested
// const handle404 = customErrors.handle404
// // we'll use this function to send 401 when a user tries to modify a resource
// // that's owned by someone else
// const requireOwnership = customErrors.requireOwnership
//
// // this is middleware that will remove blank fields from `req.body`, e.g.
// // { step: { title: '', text: 'foo' } } -> { step: { text: 'foo' } }
// const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX /steps
router.get('/steps', requireToken, (req, res, next) => {
  Step.find()
    .then(steps => {
      // `steps` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return steps.map(step => step.toObject())
    })
    // respond with status 200 and JSON of the steps
    .then(steps => res.status(200).json({ steps: steps }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /steps
router.post('/steps', requireToken, (req, res, next) => {
  // assigns the user id to the owner property within step, so step will be
  // assigned to the proper user account
  req.body.step.owner = req.user.id

  Step.create(req.body.step)
    // respond to succesful `create` with status 201 and JSON of new "step"
    .then(step => {
      res.status(201).json({ step: step.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

module.exports = router
