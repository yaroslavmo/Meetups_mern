const express = require("express");
const router = express.Router();

const meetups = require("./api/meetups");
const guests = require("./api/guests");
const users = require("./api/users");

router.use("/users", users);
router.use("/meetups", meetups);
router.use("/guests", guests);

module.exports = router;
