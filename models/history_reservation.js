'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var HistoryReservationSchema = Schema({
  timestamp: { type: Date, default: Date.now },
  reservation: { type: Schema.ObjectId, ref: 'Reservation'}
});

module.exports = mongoose.model('History_Reservation', HistoryReservationSchema);
