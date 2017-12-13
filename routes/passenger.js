'use strict'

const express = require('express');
var PassengerController = require('../controllers/passenger');

const api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/register',  PassengerController.savePassenger);
api.post('/login', PassengerController.loginPassenger);
api.put('/update-passenger/:id', md_auth.ensureAuth, PassengerController.updatePassenger);
api.delete('/passenger/:id', md_auth.ensureAuth, PassengerController.deletePassenger);

module.exports = api;
