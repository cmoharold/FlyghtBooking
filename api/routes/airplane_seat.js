'use strict'

const express = require('express');
var AirplaneSeatController = require('../controllers/airplane_seat');

const api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/airplane-seat/:id', md_auth.ensureAuth, AirplaneSeatController.getAirplaneSeat);
api.get('/airplane-seats/:airplane', md_auth.ensureAuth, AirplaneSeatController.getAirplaneSeats);
api.post('/airplane-seat', md_auth.ensureAuth, AirplaneSeatController.saveAirplaneSeat);
api.put('/airplane-seat/:id', md_auth.ensureAuth, AirplaneSeatController.updateAirplaneSeat);
api.delete('/airplane-seat/:id', md_auth.ensureAuth, AirplaneSeatController.deleteAirplaneSeat);

module.exports = api;
