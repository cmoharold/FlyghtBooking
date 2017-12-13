'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var AirplaneSchema = Schema({
  model: String,
  registration: String,
  image: String,
  airline: { type: Schema.ObjectId, ref: 'Airline'}
});

module.exports = mongoose.model('Airplane', AirplaneSchema);
