'use strict'

const path = require('path');
const moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
var Flyght = require('../models/flyght');
var Reservation = require('../models/reservation');
var HistoryReservation = require('../models/history_reservation');

function getFlyght(req, res) {
  var flyghtId = req.params.id;

  Flyght.findById(flyghtId).populate({path: 'airplane'}).exec((err, flyght) => {
    if(err) {
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!flyght) {
        res.status(404).send({message: 'El vuelo no existe'});
      }else{
        res.status(200).send({flyght: flyght});
      }
    }
  });
}

// function getFlyghtByCode(req, res) {
//   var flyghtCode = req.params.code;
//
//   Flyght.findById(flyghtCode).populate({path: 'airplane'}).exec((err, flyght) => {
//     if(err) {
//       res.status(500).send({message: 'Error en la petición2'});
//     }else{
//       if(!flyght) {
//         res.status(404).send({message: 'El vuelo no existe'});
//       }else{
//         res.status(200).send({flyght: flyght});
//       }
//     }
//   });
// }

function getFlyghts(req, res) {
  var airplaneId = req.params.airplane;
  var flyghtCode = req.params.code;
  var flyghtOrigin = req.params.origin;
  var flyghtDestination = req.params.destination;
  var flyghtDate = req.params.date;

  if(req.params.pag){
    var page = req.params.pag;
  }else{
    var page = 1;
  }

  var itemsPerPage = 4;

  if(airplaneId) {
    var find = Flyght.find({airplane: airplaneId}).sort('date');
  } else if (flyghtCode) {
    var find = Flyght.find({code: flyghtCode}).sort('date');
  } else if (flyghtOrigin) {
    var find = Flyght.find({origin: flyghtOrigin}).sort('date');
  } else if (flyghtDestination) {
    var find = Flyght.find({destination: flyghtDestination}).sort('date');
  } else if (flyghtDate) {
    var find = Flyght.find({date: flyghtDate}).sort('date');
  } else {
    var find = Flyght.find({}).sort('date');
  }

  find.populate({path: 'airplane'}).paginate(page, itemsPerPage, (err, flyghts, total) => {
    if(err) {
      res.status(500).send({message: 'Error en la petición'});
    }else {
      if(!flyghts) {
        res.status(404).send({message: 'No hay vuelos'});
      }else{
        // res.status(200).send({flyghts});
        return res.status(200).send({
          total_items: total,
          flyghts: flyghts
        });
      }
    }
  });
}

function saveFlyght(req, res) {
  var flyght = new Flyght();

  var params = req.body;
  flyght.code = params.code;
  flyght.origin = params.origin;
  flyght.destination = params.destination;
  flyght.date = moment().format(params.date);
  flyght.airplane = params.airplane;

  flyght.save((err, flyghtStored) => {
    if(err) {
      res.status(500).send({message: 'Error en el servidor: ' + err});
    }else{
      if(!flyghtStored) {
        res.status(404).send({message: 'No se ha guardado el vuelo'});
      }else{
        res.status(200).send({flyght: flyghtStored});
      }
    }
  });
}

function updateFlyght(req, res) {
  var flyghtId = req.params.id;
  var update = req.body;

  Flyght.findByIdAndUpdate(flyghtId, update, (err, flyghtUpdated) => {
    if(err) {
      res.status(500).send({message: 'Error al actualizar los datos del vuelo'});
    }else{
      if(!flyghtUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar los datos del vuelo'});
      }else{
        res.status(200).send({flyght: flyghtUpdated});
      }
    }
  });
}

function deleteFlyght(req, res){
  var flyghtId =  req.params.id;

  Flyght.findByIdAndRemove(flyghtId, (err, flyghtRemoved) => {
    if(err) {
      res.status(500).send({message: 'Error al eliminar el vuelo'});
    }else{
      if(!flyghtRemoved) {
        res.status(404).send({message: 'El avión no ha sido eliminado'});
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
                    res.status(200).send({flyght: flyghtRemoved});
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
  getFlyght,
  // getFlyghtByCode,
  getFlyghts,
  saveFlyght,
  updateFlyght,
  deleteFlyght
};
