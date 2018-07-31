const express = require("express");
const router = express.Router();

const Meetup = require("../../models/Meetup");

router.get("/", function(req, res) {
  Meetup.find()
    .then(meetups => res.json(meetups))
    .catch(err => res.status(500).json({ error: err }));
});

router.post("/", function(req, res) {
  Meetup.create(req.body)
    .then(m => res.json(m))
    .catch(err => res.status(500).json({ error: err }));
});

router.get("/:id", function(req, res) {
  Meetup.findById(req.params.id)
    .then(m => res.json(m))
    .catch(err => res.status(500).json({ error: err }));
});

router.delete("/:id", function(req, res) {
  Meetup.findByIdAndRemove(req.params.id)
    .then(m => res.status(204).json("OK"))
    .catch(err => res.status(500).json({ error: err }));
});

router.patch("/:id", function(req, res) {
  Meetup.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(m => res.json(m))
    .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;
