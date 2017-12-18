'use strict'

const path = require('path');
const moment = require('moment');
var Reservation = require('../models/reservation');
var History_Reservation = require('../models/history_reservation');

function getReservation(req, res) {
  var reservationId = req.params.id;

  Reservation.findById(reservationId).populate({path: 'passenger'}).
  populate({path: 'flyght'}).populate({path: 'seat'}).
  exec((err, reservation) => {
    if(err) {
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!reservation) {
        res.status(404).send({message: 'La reserva no existe'});
      }else{
        res.status(200).send({reservation: reservation});
      }
    }
  });
}

function getReservations(req, res) {
  var reservationCode = req.params.code;
  var flyghtId = req.params.flyght;
  var passengerId = req.params.passenger;
  var seatId = req.params.seat;

  if(req.params.pag){
    var page = req.params.pag;
  } else {
    var page = 1;
  }

  var itemsPerPage = 4;

  if(reservationCode) {
    var find = Reservation.find({code: reservationCode}).sort('timestamp');
  } else if (flyghtId) {
    var find = Reservation.find({flyght: flyghtId}).sort('timestamp');
  } else if (passengerId) {
    var find = Reservation.find({passenger: passengerId}).sort('timestamp');
  } else if (seatId) {
    var find = Reservation.find({seat: seatId}).sort('timestamp');
  } else {
    var find = Reservation.find({}).sort('timestamp');
  }

  find.populate({path: 'passenger', select: 'name'}).populate({path: 'flyght'}).
  populate({path: 'airplane_seat', select: 'class'}).paginate(page, itemsPerPage, (err, reservations, total) => {
    if(err) {
      res.status(500).send({message: 'Error en la petición ' + err});
    }else {
      if(!reservations) {
        res.status(404).send({message: 'No se han encontrado reservas'});
      }else{
        // res.status(200).send({reservations});
        return res.status(200).send({
          total_items: total,
          reservations: reservations
        });
      }
    }
  });
}

function saveReservation(req, res) {
  var reservation = new Reservation();
  var history_Reservation = new History_Reservation();

  var params = req.body;
  reservation.code = params.code;
  reservation.passenger = params.passenger;
  reservation.flyght = params.flyght;
  reservation.timestamp = moment();
  reservation.seat = params.airplane_seat;

  reservation.save((err, reservationStored) => {
    if(err) {
      res.status(500).send({message: 'Error en el servidor: ' + err});
    }else{
      if(!reservationStored) {
        res.status(404).send({message: 'No se ha guardado la reserva'});
      }else{
        // res.status(200).send({reservation: reservationStored});
        history_Reservation.timestamp = reservationStored.timestamp;
        history_Reservation.reservation = reservationStored._id;
        history_Reservation.save((err, reservationHistStored) => {
          if(err) {
            res.status(500).send({message: 'Error en el servidor: ' + err});
          }else{
            if(!reservationHistStored) {
              res.status(404).send({message: 'No se ha guardado el histórico de reserva'});
            }else{
              res.status(200).send({reservation: reservationStored,
                                    reservationHist: reservationHistStored});
            }
          }
        });
      }
    }
  });
}

function updateReservation(req, res) {
  var reservationId = req.params.id;
  var update = req.body;

  Reservation.findByIdAndUpdate(reservationId, update, (err, reservationUpdated) => {
    if(err) {
      res.status(500).send({message: 'Error al actualizar la reserva'});
    }else{
      if(!reservationUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar la reserva'});
      }else{
        res.status(200).send({reservation: reservationUpdated});
      }
    }
  });
}

function deleteReservation(req, res){
  var reservationId =  req.params.id;

  Reservation.findByIdAndRemove(reservationId, (err, reservationRemoved) => {
    if(err) {
      res.status(500).send({message: 'Error al eliminar la reserva'});
    }else{
      if(!reservationRemoved) {
        res.status(404).send({message: 'La reserva no ha sido eliminada'});
      }else{
        History_Reservation.find({reservation: reservationRemoved._id}).remove((err, histReservationRemoved) => {
          if(err) {
            res.status(500).send({message: 'Error al eliminar el histórico de reserva'});
          }else{
            if(!histReservationRemoved) {
              res.status(404).send({message: 'El histórico de reserva no ha sido eliminada'});
            }else{
              res.status(200).send({flyght: reservationRemoved});
            }
          }
        });
      }
    }
  });
}

module.exports = {
  getReservation,
  getReservations,
  saveReservation,
  updateReservation,
  deleteReservation
};
