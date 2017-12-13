'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
var secret = 'clave_secret';

exports.createToken = function(passenger) {
  var payload = {
    sub: passenger.id,
    name: passenger.name,
    role: passenger.role,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix
  };

  return jwt.encode(payload, secret);
}
