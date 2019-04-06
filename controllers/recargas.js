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
            'key': '03becfc25edfa5092f7c5f',
            'id': '9720',
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
            var res = nojson.respuesta;
            response.status(200).send({
                respuesta: res
            });

        }

    })


    /*  guardar recarga en BD
recarga.save(); */
} // fin de doRecarga


// Query para sacar datos de la Db
function pruebas(req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("claro");
        dbo.collection("recargas").findOne({}, function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
        });
    });

    res.status(200).send({
        message: 'probando el controlador de recargas'
    });
}
/* 
 function pruebas(req, res) {
    var str = "";
    MongoClient.connect(url, function(err, db) {

        var cursor = db.collection('recargas').find();
    
        cursor.each(function(err, item) {
    
            if (item != null) {
                str = str + "    Employee id  " + item._id + "</br>";
            }
    
        });
    }); 
    res.status(200).send({
        message: 'probando el controlador de recargas'
    });
} */

module.exports = {
    DoRecarga
};