'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var AirlineSchema = Schema({
  name: String
});

module.exports = mongoose.model('Airline', AirlineSchema);
