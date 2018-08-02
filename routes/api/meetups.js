const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Meetup = require("../../models/Meetup");

// Validation
const validateMeetupInput = require("../../validation/meetup");
const validateCommentInput = require("../../validation/comment");

// @route   GET api/meetups
// @desc    Get meetups
// @access  Public
router.get("/", (req, res) => {
  Meetup.find()
    .sort({ date: -1 })
    .then(meetups => res.json(meetups))
    .catch(err => res.status(404).json({ nomeetupsfound: "No Meetups found" }));
});

// @route   GET api/meetups/:id
// @desc    Get meetups by id
// @access  Public
router.get("/:id", (req, res) => {
  Meetup.findById(req.params.id)
    .populate({
      path: 'guests',
      populate: { path: 'user' }
    })
    .then(meetup => res.json(meetup))
    .catch(err =>
      res.status(404).json({ nomeetupfound: "No meetup found with that ID" })
    );
});

// @route   POST api/meetups
// @desc    Create meetup
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //FIXME: admin check
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ notadmin: "You are not belong there" });
    // }

    const { errors, isValid } = validateMeetupInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newMeetup = new Meetup({
      title: req.body.title,
      date: req.body.date
    });

    newMeetup.save().then(meetup => res.json(meetup));
  }
);

// @route   DELETE api/meetups/:id
// @desc    Delete meetup
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Meetup.findById(req.params.id)
      .then(meetup => {
        //FIXME: check for admin
        // Check for user admin
        if (!meetup.guests.includes(req.user)) {
          return res.status(403).json({ notadmin: "You are not belong there" });
        }
        // Delete
        meetup.remove().then(() => res.json({ success: true }));
      })
      .catch(err =>
        res.status(404).json({ meetupnotfound: "No meetup found" })
      );
  }
);

// @route   PUT api/meetups/:id/like
// @desc    Like meetup
// @access  Private
router.put(
  "/:id/like",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Meetup.findById(req.params.id)
      .then(meetup => {
        if (
          meetup.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: "You already liked this meetup" });
        }

        Meetup.likeById(meetup._id, req.user.id).then(meetup =>
          res.json(meetup)
        );
      })
      .catch(err => res.status(404).json({ meetupnotfound: "No post found" }));
  }
);

// @route   DELETE api/meetups/:id/like
// @desc    Like meetup
// @access  Private
router.delete(
  "/:id/like",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Meetup.findById(req.params.id)
      .then(meetup => {
        if (
          meetup.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ notliked: "You have not yet liked this meetup" });
        }
        Meetup.unlikeById(meetup._id, req.user).then(meetup =>
          res.json(meetup)
        );
      })
      .catch(err =>
        res.status(404).json({ meetupnotfound: "No meetup found" })
      );
  }
);

// @route   POST api/:id/comment
// @desc    Add comment to meetup
// @access  Private
router.post(
  "/:id/comment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Meetup.findById(req.params.id)
      .then(meetup => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        Meetup.addComment(meetup._id, newComment).then(meetup =>
          res.json(meetup)
        );
      })
      .catch(err =>
        res.status(404).json({ meetupnotfound: "No meetup found" })
      );
  }
);

// @route   DELETE api/meetups/:id/comment/:comment_id
// @desc    Remove comment from meetup
// @access  Private
router.delete(
  "/:id/comment/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Meetup.findById(req.params.id)
      .then(meetup => {
        // Check to see if comment exists
        if (
          meetup.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }
        Meetup.deleteCommentById(meetup._id, req.params.comment_id).then(
          meetup => res.json(meetup)
        );
      })
      .catch(err =>
        res.status(404).json({ meetupnotfound: "No meetup found" })
      );
  }
);


// @route   POST api/:id/subscription
// @desc    Add user to meetup guests
// @access  Private
router.post(
  "/:id/subscription",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {


    
    Meetup.findById(req.params.id)
      .then(meetup => {
        if (
          meetup.guests.filter(guest => guest.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadysubscribed: "You already subscribed to this meetup" });
        }

        Meetup.subscribe(meetup._id, req.user).then(meetup =>
          res.json(meetup)
        );
      })
      .catch(err =>
        res.status(404).json({ meetupnotfound: "No meetup found" })
      );
  }
);

// @route   DELETE api/meetups/:id/subscription
// @desc    Unsubscribe from meetup
// @access  Private
router.delete(
  "/:id/subscription",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Meetup.findById(req.params.id)
      .then(meetup => {
        // Check to see if guest already subscribed
        if (
          meetup.guests.filter(
            guest => guest.user.toString() === req.user.id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ subscriptiondontexists: "You have not subscribed to this meetup yet" });
        }
        Meetup.deleteSubscription(meetup._id, req.user.id).then(
          meetup => res.json(meetup)
        );
      })
      .catch(err =>
        res.status(404).json({ meetupnotfound: "No meetup found" })
      );
  }
);

// router.post("/", function(req, res) {
//   Meetup.create(req.body)
//     .then(m => res.json(m))
//     .catch(err => res.status(500).json({ error: err }));
// });

// router.get("/:id", function(req, res) {
//   Meetup.findById(req.params.id)
//     .then(m => res.json(m))
//     .catch(err => res.status(500).json({ error: err }));
// });

// router.delete("/:id", function(req, res) {
//   Meetup.findByIdAndRemove(req.params.id)
//     .then(m => res.status(204).json("OK"))
//     .catch(err => res.status(500).json({ error: err }));
// });

// router.patch("/:id", function(req, res) {
//   Meetup.findByIdAndUpdate(req.params.id, req.body, { new: true })
//     .then(m => res.json(m))
//     .catch(err => res.status(500).json({ error: err }));
// });

module.exports = router;
