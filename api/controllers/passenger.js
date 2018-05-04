'use strict'

const bcrypt = require('bcrypt-nodejs');
var Passenger = require('../models/passenger');
var Reservation = require('../models/reservation');
var HistoryReservation = require('../models/history_reservation');
var jwt = require('../services/jwt');

function savePassenger(req, res) {
  var passenger = new Passenger();

  var params = req.body;

  passenger.name = params.name;
  passenger.role = 'ROLE_CLIENT';

  if(params.password) {
    bcrypt.hash(params.password, null, null, function(err, hash) {
      passenger.password =  hash;
      if(passenger.name != null) {
        passenger.save((err, passengerStored) => {
          if (err) {
            res.status(500).send({mensaje: 'Error al guardar el pasajero'});
          }else {
            if (!passengerStored) {
              res.status(404).send({mensaje: 'No se ha registrado el pasajero'});
            }else{
              res.status(200).send({passenger: passengerStored});
            }
          }
        });
      } else {
        res.status(200).send({mensaje: 'Complete los datos solicitados'});
      }
    });
  }else {
    res.status(500).send({ message : 'Introduce la contraseña'});
  }
}

function loginPassenger(req, res) {
  var params = req.body;

  var name = params.name;
  var password = params.password;

  Passenger.findOne({name: name}, (err, passenger) => {
    if (err) {
      res.status(500).send({message: 'Error en la petición'});
    }else {
      if (!passenger) {
        res.status(404).send({message: 'El pasajero no existe'});
      }else {
        //Comprobar la contraseña
        bcrypt.compare(password, passenger.password, function(err, check) {
          if (check) {
            //devolver los datos del pasajero logueado
            if(params.gethash){
              //devolver un token de jwt
              res.status(200).send({
                token: jwt.createToken(passenger)
              })
            }else {
              res.status(200).send({passenger});
            }
          }else {
            res.status(404).send({message: 'El pasajero no ha podido loguearse'});
          }
        });
      }
    }
  });
}

function updatePassenger(req, res) {
  var passengerId = req.params.id;
  var update = req.body;

  if(passengerId !== req.passenger.sub) {
    return res.status(500).send({message: 'No tienes permiso para actualizar este pasajero'});
  }

  Passenger.findByIdAndUpdate(passengerId, update, (err, passengerUpdated) => {
    if(err) {
      res.status(500).send({message: 'Error al actualizar el pasajero'});
    }else{
      if(!passengerUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar el pasajero'});
      }else{
        res.status(200).send({passenger: passengerUpdated});
      }
    }
  });
}

function deletePassenger(req, res) {
  var passengerId = req.params.id;
  Passenger.findByIdAndRemove(passengerId, (err, passengerRemoved) => {
    if(err){
      res.status(500).send({message: 'Error en el servidor'});
    }else{
      if(!passengerRemoved) {
        res.status(404).send({message: 'No se ha borrado el pasajero'});
      }else{
        Reservation.find({passenger: passengerRemoved._id}).remove((err, reservationRemoved) => {
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
                    res.status(200).send({passenger: passengerRemoved});
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

module.exports = {
  savePassenger,
  loginPassenger,
  updatePassenger,
  deletePassenger
};
