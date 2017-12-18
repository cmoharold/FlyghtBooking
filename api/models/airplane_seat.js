'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var AirlineSeatSchema = Schema({
  class: String,
  seat: String,
  airplane: { type: Schema.ObjectId, ref: 'Airplane'}
});

module.exports = mongoose.model('Airplane_Seat', AirlineSeatSchema);
