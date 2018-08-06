const express = require("express");
const router = express.Router();

const meetups = require("./api/meetups");
const users = require("./api/users");
const profile = require("./api/profile");

router.use("/users", users);
router.use("/profile", profile);
router.use("/meetups", meetups);

module.exports = router;
