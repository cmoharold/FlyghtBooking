'use strict'

const path = require('path');
const fs = require('fs');
var Airline = require('../models/airline');
var Airplane = require('../models/airplane');
var Flyght = require('../models/flyght');
var Reservation = require('../models/reservation');
var HistoryReservation = require('../models/history_reservation');

function getAirplane(req, res) {
  var airplaneId = req.params.id;

  Airplane.findById(airplaneId).populate({path: 'airline'}).exec((err, airplane) => {
    if(err) {
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!airplane) {
        res.status(404).send({message: 'El avión no existe'});
      }else{
        res.status(200).send({airplane: airplane});
      }
    }
  });
}

function getAirplanes(req, res) {
  var airlineId = req.params.airline;

  if(!airlineId) {
    //Sacar todos los aviones de la bbdd
    var find = Airplane.find({}).sort('registration');
  }else {
    //Sacar los aviones de una aerolinea
    var find = Airplane.find({airline: airlineId}).sort('registration');
  }

  // var find = Airplane.find({airline: airlineId}).sort('registration');

  find.populate({path: 'airline'}).exec((err, airplanes) => {
    if(err) {
      res.status(500).send({message: 'Error en la petición'});
    }else {
      if(!airplanes) {
        res.status(404).send({message: 'No hay aviones'});
      }else{
        res.status(200).send({airplanes});
      }
    }
  });
}

function saveAirplane(req, res) {
  var airplane = new Airplane();

  var params = req.body;
  airplane.model = params.model;
  airplane.registration = params.registration;
  airplane.image = "";
  airplane.airline = params.airline;

  airplane.save((err, airplaneStored) => {
    if(err) {
      res.status(500).send({message: 'Error en el servidor: ' + err});
    }else{
      if(!airplaneStored) {
        res.status(404).send({message: 'No se ha guardado el avión'});
      }else{
        res.status(200).send({airplane: airplaneStored});
      }
    }
  });
}

function updateAirplane(req, res) {
  var AirplaneId = req.params.id;
  var update = req.body;

  Airplane.findByIdAndUpdate(AirplaneId, update, (err, airplaneUpdated) => {
    if(err) {
      res.status(500).send({message: 'Error al actualizar los datos del avión'});
    }else{
      if(!airplaneUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar los datos del avión'});
      }else{
        res.status(200).send({airplane: airplaneUpdated});
      }
    }
  });
}

function deleteAirplane(req, res){
  var airplaneId =  req.params.id;

  Airplane.findByIdAndRemove(airplaneId, (err, airplaneRemoved) => {
    if(err) {
      res.status(500).send({message: 'Error al eliminar el avión'});
    }else{
      if(!airplaneRemoved) {
        res.status(404).send({message: 'El avión no ha sido eliminado'});
      }else{
        Flyght.find({airplane: airplaneRemoved._id}).remove((err, flyghtRemoved) => {
          if(err) {
            res.status(500).send({message: 'Error al eliminar el vuelo'});
          }else{
            if(!flyghtRemoved) {
              res.status(404).send({message: 'El vuelo no ha sido eliminado'});
            }else{
              Reservation.find({flyght: flyghtRemoved._id}).remove((err, reservationRemoved) => {
                if(err) {
                  res.status(500).send({message: 'Error al eliminar la reserva'});
                }else{
                  if(!reservationRemoved) {
                    res.status(404).send({message: 'La reserva no ha sido eliminada'});
                  }else{
                    HistoryReservation.find({reservation: reservationRemoved._id}).remove((err, histReservationRemoved) => {
                      if(err) {
                        res.status(500).send({message: 'Error al eliminar el histórico de reserva'});
                      }else{
                        if(!histReservationRemoved) {
                          res.status(404).send({message: 'El histórico de reserva no ha sido eliminada'});
                        }else{
                          res.status(200).send({airplane: airplaneRemoved});
                        }
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  });
}

function upLoadImage(req, res) {
  var airplaneId = req.params.id;
  var file_name = 'No subido...';

  if(req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      Artist.findByIdAndUpdate(airplaneId, {image: file_name}, (err, airplaneUpdated) => {
        if(!airplaneId) {
          res.status(404).send({message: 'No se ha podido actualizar el avión'});
        }else{
          res.status(200).send({airplane: airplaneUpdated});
        }
      });
    }else {
      res.status(200).send({message: 'Extensión del archivo no válida'});
    }

    console.log(file_path);
  }else{
    res.status(200).send({message: 'No has subido ninguna imagen'});
  }
}

function getImageFile(req, res) {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/airplanes/' + imageFile;

  fs.exists(path_file, function(exists) {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'No existe la imagen: ' + path_file});
    }
  });
}

module.exports = {
  getAirplane,
  getAirplanes,
  saveAirplane,
  updateAirplane,
  deleteAirplane,
  upLoadImage,
  getImageFile
};
