const express = require('express')
const router = express.Router()

const Meetup = require('../models/Meetup')

router.get('/meetups', function(req, res) {
  Meetup.find()
    .then(meetups => res.json(meetups))
    .catch(err => res.status(500).json({error: err}))
})

router.post('/meetups', function (req, res) {
  Meetup.create(req.body)
    .then(m => res.json(m))
    .catch(err => res.status(500).json({error: err}))
})

router.post('/:say', function (req, res) {
  let say = req.params.say
  let { first, last } = req.body
  let message = `${say} ${first} ${last}!`
  res.json({ message });
})

module.exports = router