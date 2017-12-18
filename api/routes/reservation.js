'use strict'

const express = require('express');
var ReservationController = require('../controllers/reservation');

const api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/reservation', md_auth.ensureAuth, ReservationController.saveReservation);
api.put('/reservation/:id', md_auth.ensureAuth, ReservationController.updateReservation);
api.get('/reservation/:id', md_auth.ensureAuth, ReservationController.getReservation);
api.get('/reservations/:code?/:pag?', md_auth.ensureAuth, ReservationController.getReservations);
api.get('/reservationsbyflyght/:flyght', md_auth.ensureAuth, ReservationController.getReservations);
api.get('/reservationsbypassenger/:passenger', md_auth.ensureAuth, ReservationController.getReservations);
api.get('/reservationsbyseat/:seat', md_auth.ensureAuth, ReservationController.getReservations);
api.delete('/reservation/:id', md_auth.ensureAuth, ReservationController.deleteReservation);

module.exports = api;
