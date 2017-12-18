'use strict'

const express = require('express');
var FlyghtController = require('../controllers/flyght');

const api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/flyght', md_auth.ensureAuth, FlyghtController.saveFlyght);
api.put('/flyght/:id', md_auth.ensureAuth, FlyghtController.updateFlyght);
api.get('/flyght/:id', md_auth.ensureAuth, FlyghtController.getFlyght);
api.get('/flyghtsbycode/:code', md_auth.ensureAuth, FlyghtController.getFlyghts);
api.get('/flyghtsbyorigin/:origin/:pag?', md_auth.ensureAuth, FlyghtController.getFlyghts);
api.get('/flyghtsbydestination/:destination', md_auth.ensureAuth, FlyghtController.getFlyghts);
api.get('/flyghtsbydate/:date', md_auth.ensureAuth, FlyghtController.getFlyghts);
api.get('/flyghts/:airplane?', md_auth.ensureAuth, FlyghtController.getFlyghts);
api.delete('/flyght/:id', md_auth.ensureAuth, FlyghtController.deleteFlyght);

module.exports = api;
