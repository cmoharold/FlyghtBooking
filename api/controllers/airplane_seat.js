'use strict'

var AirplaneSeat = require('../models/airplane_seat');
var Reservation = require('../models/reservation');
var HistoryReservation = require('../models/history_reservation');

function getAirplaneSeat(req, res) {
  var airplaneSeatId = req.params.id;

  AirplaneSeat.findById(airplaneSeatId).populate({path: 'airplane'}).exec((err, airplaneSeat) => {
    if(err) {
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!airplaneSeat) {
        res.status(404).send({message: 'El asiento de avión no existe'});
      }else{
        res.status(200).send({airplaneSeat: airplaneSeat});
      }
    }
  });
}

function getAirplaneSeats(req, res) {
  var airplaneId = req.params.airplane;

  if(!airplaneId) {
    //Sacar todos los aviones de la bbdd
    var find = AirplaneSeat.find({}).sort('class').sort('seat');
  }else {
    //Sacar los aviones de una aerolinea
    var find = AirplaneSeat.find({airplane: airplaneId}).sort('class').sort('seat');
  }

  find.populate({path: 'airplane'}).exec((err, airplaneSeats) => {
    if(err) {
      res.status(500).send({message: 'Error en la petición'});
    }else {
      if(!airplaneSeats) {
        res.status(404).send({message: 'No hay asientos de aviones'});
      }else{
        res.status(200).send({airplaneSeats});
      }
    }
  });
}

function saveAirplaneSeat(req, res) {
  var airplaneSeat = new AirplaneSeat();

  var params = req.body;
  airplaneSeat.class = params.class;
  airplaneSeat.seat = params.seat;
  airplaneSeat.airplane = params.airplane;

  airplaneSeat.save((err, airplaneSeatStored) => {
    if(err) {
      res.status(500).send({message: 'Error en el servidor: ' + err});
    }else{
      if(!airplaneSeatStored) {
        res.status(404).send({message: 'No se ha guardado el asiento'});
      }else{
        res.status(200).send({airplaneSeat: airplaneSeatStored});
      }
    }
  });
}

function updateAirplaneSeat(req, res) {
  var AirplaneSeatId = req.params.id;
  var update = req.body;

  AirplaneSeat.findByIdAndUpdate(AirplaneSeatId, update, (err, airplaneSeatUpdated) => {
    if(err) {
      res.status(500).send({message: 'Error al actualizar los datos del asiento'});
    }else{
      if(!airplaneSeatUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar los datos del asiento'});
      }else{
        res.status(200).send({airplaneSeat: airplaneSeatUpdated});
      }
    }
  });
}

function deleteAirplaneSeat(req, res){
  var airplaneSeatId =  req.params.id;

  AirplaneSeat.findByIdAndRemove(airplaneSeatId, (err, airplaneSeatRemoved) => {
    if(err) {
      res.status(500).send({message: 'Error al eliminar el asiento'});
    }else{
      if(!airplaneSeatRemoved) {
        res.status(404).send({message: 'El asiento no ha sido eliminado'});
      }else{
        Reservation.find({airplane_seat: airplaneSeatRemoved._id}).remove((err, reservationRemoved) => {
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
                    res.status(200).send({airplane: airplaneSeatRemoved});
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
  getAirplaneSeat,
  getAirplaneSeats,
  saveAirplaneSeat,
  updateAirplaneSeat,
  deleteAirplaneSeat
};
