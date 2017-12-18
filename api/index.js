'use strict'

const mongoose = require('mongoose');
var app = require('./app');
const port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/flight_reservation', (err, res) => {
  if(err) {
    throw err;
  }else {
    console.log("La conexión a la base de datos está funcionando correctamente...");

    app.listen(port, function() {
      console.log("Servidor del api rest de sistema de reserva en http://localhost:"+port);
    });
  }
});
