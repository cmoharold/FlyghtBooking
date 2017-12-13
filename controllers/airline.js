'use strict'

var Airline = require('../models/airline');
var jwt = require('../services/jwt');

function saveAirline(req, res) {
  var airline = new Airline();

  var params = req.body;
  airline.name = params.name;

  if(airline.name != null) {
    airline.save((err, airlineStored) => {
      if (err) {
        res.status(500).send({mensaje: 'Error al guardar la aerolinea'});
      }else {
        if (!airlineStored) {
          res.status(404).send({mensaje: 'No se ha registrado la aerolinea'});
        }else{
          res.status(200).send({airline: airlineStored});
        }
      }
    });
  } else {
    res.status(200).send({mensaje: 'Complete los datos solicitados'});
  }
}

function updateAirline(req, res) {
  var AirlineId = req.params.id;
  var update = req.body;

  Airline.findByIdAndUpdate(AirlineId, update, (err, airlineUpdated) => {
    if(err) {
      res.status(500).send({message: 'Error al actualizar la aerolinea'});
    }else{
      if(!airlineUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar la aerolinea'});
      }else{
        res.status(200).send({airline: airlineUpdated});
      }
    }
  });
}

module.exports = {
  saveAirline,
  updateAirline
};
