const express = require("express");
const router = express.Router();

const meetups = require("./api/meetups");
const users = require("./api/users");

router.use("/users", users);
router.use("/meetups", meetups);

module.exports = router;
