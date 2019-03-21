'use strict'
// importamos los modulos
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_claroRecargas';


exports.createToken = function(existe) {
    // payload es un objeto con el que jwt trabajara para generar el cifrado, osea el token
    var payload = {
        sub: existe._id,
        name: existe.name,
        lastname: existe.lastname,
        iden: existe.iden,
        email: existe.email,
        cel: existe.cel,
        status: existe.status,
        role: existe.role,
        iat: moment().unix, // fecha de creacion del token
        exp: moment().add(30, 'days').unix // fecha expiracion del token
    };
    // el segundo parametro 'secret'es una clave secreta, me sirve para cifrar el token
    return jwt.encode(payload, secret)
};