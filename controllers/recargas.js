'use strict'
// modulos
var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var moment = require('moment');

// modelos
var Recarga = require('../models/recargas');
// var Productos = require('../models/productos');

// servicios
var jwt = require('../services/jwt');


function DoRecarga(req, res) {

    var parametros = req.body;

    var recarga = new Recarga();

    recarga.numero = parametros.numero;
    recarga.monto = parametros.monto;
    recarga.producto = parametros.producto;
    recarga.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
    recarga.fec_upd = moment().format('YYYY MM DD HH:mm:ss');


    var options = {
        url: 'http://70.38.107.45:8090/recar',
        body: JSON.stringify({
            'key': '874331422b9b30de87b0177b0974b925',
            'id': '5814',
            'monto': parametros.monto,
            'celular': parametros.numero,
            'producto': parametros.producto
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }

    request(options, function(error, response, body) {
        console.log("llega a request", body);
        if (!error && response.statusCode == 200) {

            console.log(body);
            var nojson = JSON.parse(body);
            console.log("este es el nojson " + nojson.respuesta);
            var respu = nojson.respuesta;
            res.status(200).send({
                respuesta: respu
            });

        }

    })



} // fin de doRecarga


function getSaldo(req, res) {
    console.log("Show saldo");
    var options = {
        url: 'http://70.38.107.45:8090/misald/5814/874331422b9b30de87b0177b0974b925',
        method: 'GET',
    }

    request(options, function(error, response, body) {
        console.log("llega a request", body);
        if (!error && response.statusCode == 200) {

            console.log(body);
            var nojson = JSON.parse(body);
            console.log("este es el nojson " + nojson.respuesta);
            var respu = nojson.respuesta;
            res.status(200).send({
                respuesta: respu
            });

        } else {
            var nojson = JSON.parse(body);
            var respu = nojson.respuesta;
            console.log("error", respu);
            res.status(400).send({
                respuesta: respu
            })
        }

    })

}


module.exports = {
    DoRecarga,
    getSaldo
};
