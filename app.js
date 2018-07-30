const express = require('express')
const app = express()
const router = require('./routes')
const monggose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')



const db = require('./Config/keys').mongoURI;

monggose.connect(db, function (err) {
  if (err) {
    console.error('Mongo connection FAIL: ' + err)
  } else {
    console.log('Mongo connection OK')
  }
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Paspors midd
app.use(passport.initialize())

//Passport Config
require('./Config/passport')(passport);

app.use(express.json())
app.use('/api', router)

module.exports = app