const express = require('express')
const router = express.Router()

const Guest = require('../models/Guest')

router.get('/guests', function(req, res) {
  Guest.find()
    .then(guests => res.json(guests))
    .catch(err => res.status(500).json({error: err}))
})

router.post('/guests', function (req, res) {
  Guest.create(req.body)
    .then(m => res.json(m))
    .catch(err => res.status(500).json({error: err}))
})

router.get('/guests/:id', function (req, res) {
  Guest.findById(req.params.id)
    .then(m => res.json(m))
    .catch(err => res.status(500).json({error: err}))
})

router.delete('/guests/:id', function (req, res) {
  Guest.findByIdAndRemove(req.params.id)
    .then(m => res.status(204).json('OK'))
    .catch(err => res.status(500).json({error: err}))
})

router.patch('/guests/:id', function (req, res) {
  Guest.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(m => res.json(m))
    .catch(err => res.status(500).json({error: err}))
})

module.exports = router