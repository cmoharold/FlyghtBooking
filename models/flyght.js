'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var FlyghtSchema = Schema({
  code: String,
  origin: String,
  destination: String,
  date: Date,
  airplane: { type: Schema.ObjectId, ref: 'Airplane'}
});

module.exports = mongoose.model('Flyght', FlyghtSchema);
