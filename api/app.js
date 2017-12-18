'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// cargar rutas
var airline_routes = require('./routes/airline');
var passenger_routes = require('./routes/passenger');
var airplane_routes = require('./routes/airplane');
var airplaneSeat_routes = require('./routes/airplane_seat');
var flyght_routes = require('./routes/flyght');
var reservation_routes = require('./routes/reservation');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// configurar cabeceras http
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  next();
});
// rutas base
app.use('/api', airline_routes);
app.use('/api', passenger_routes);
app.use('/api', airplane_routes);
app.use('/api', airplaneSeat_routes);
app.use('/api', flyght_routes);
app.use('/api', reservation_routes);
// app.get('/pruebas', function(req, res) {
//   res.status(200).send({message: "Bienvenido al curso-mean2"});
// });

module.exports = app;
