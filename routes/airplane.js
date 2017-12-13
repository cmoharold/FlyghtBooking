'use strict'

const express = require('express');
var AirplaneController = require('../controllers/airplane');

const api = express.Router();
var md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

api.post('/airplane', md_auth.ensureAuth, AirplaneController.saveAirplane);
api.put('/airplane/:id', md_auth.ensureAuth, AirplaneController.updateAirplane);
api.get('/airplane/:id', md_auth.ensureAuth, AirplaneController.getAirplane);
api.get('/airplanes/:airline?', md_auth.ensureAuth, AirplaneController.getAirplanes);
api.delete('/airplane/:id', md_auth.ensureAuth, AirplaneController.deleteAirplane);
api.post('/upload-image-airplane/:id', [md_auth.ensureAuth, md_upload], AirplaneController.upLoadImage);
api.get('/get-image-airplane/:imageFile', AirplaneController.getImageFile);

module.exports = api;
