'use strict'

const express = require('express');
var AirlineController = require('../controllers/airline');

const api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/airline', md_auth.ensureAuth, AirlineController.saveAirline);
api.put('/airline/:id', md_auth.ensureAuth, AirlineController.updateAirline);

module.exports = api;
