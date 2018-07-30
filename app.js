const express = require('express')
const app = express()
const router = require('./routes')
const monggose = require('mongoose')

const DB_URL = 'mongodb://yarik335:111Vytgja@ds020168.mlab.com:20168/meetups-mern'
monggose.connect(DB_URL, function (err) {
  if (err) {
    console.error('Mongo connection FAIL: ' + err)
  } else {
    console.log('Mongo connection OK')
  }
})

app.use(express.json())
app.use(router)

module.exports = app