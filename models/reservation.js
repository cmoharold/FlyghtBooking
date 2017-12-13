'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ReservationSchema = Schema({
  code: String,
  timestamp: { type: Date, default: Date.now },
  passenger: { type: Schema.ObjectId, ref: 'Passenger'},
  flyght: { type: Schema.ObjectId, ref: 'Flyght'},
  seat: { type: Schema.ObjectId, ref: 'Airplane_Seat'}
});

module.exports = mongoose.model('Reservation', ReservationSchema);
