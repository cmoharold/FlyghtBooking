'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PassengerSchema = Schema({
  name: String,
  password: String,
  role: String
});

module.exports = mongoose.model('Passenger', PassengerSchema);
