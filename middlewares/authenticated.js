'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_claroRecargas';

// metodo para decodificar el token
exports.ensureAuth = function(req, res, next) {
    // Comprobar si llega la cabecera de autenticacion (ya q el token llega x una cabecera llamada authorization)
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La peticion no tiene la cabecera de autenticacion' });
    }
    // variable que contiene el token
    var token = req.headers.authorization.replace(/['"]+/g, '');

    // capturar las posibles excepciones 

    // decodificamos el token
    try {
        // variable donde se guardara el objeto que decodifica el token
        var payload = jwt.decode(token, secret);

        // comprobamos si el token esta caducado
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'El token ha expirado'
            });
        }
    } catch (ex) {
        return res.status(404).send({
            message: 'El token no es valido'
        });
    }
    // creamos una propiedad (req.user) para utilizarla en todos los metodos de los controladores
    // porque le asigno a req.user el valor del payload (el objeto completo guardado del usuario)
    // de este modo, en cada accion o metodo  del controlador puedo acceder al usuario que esta logueado
    req.user = payload;
    // pasa al siguiente metodo a ejecutar
    next();
}
