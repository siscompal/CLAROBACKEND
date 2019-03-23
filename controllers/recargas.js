'use strict'
// modulos
var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var moment = require('moment');

// modelos
var Recarga = require('../models/recargas');
var Productos = require('../models/productos');

// servicios
var jwt = require('../services/jwt');
var peticion = require('../services/peticion');

function DoRecarga(req, res) {
    var parametros = req.body;
    var recarga = new Recarga();
    recarga.numero = parametros.numero;
    recarga.empresa = parametros.empresa;
    recarga.operador = parametros.operador;
    recarga.monto = parametros.monto;
    recarga.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
    recarga.fec_upd = moment().format('YYYY MM DD HH:mm:ss');


    var options = {
        url: 'http://70.38.107.45:8090/recar',
        body: JSON.stringify({
            'key': '03becfc25edfa5092f7c5f',
            'id': '9720',
            'monto': parametros.monto,
            'empresa': 'claro',
            'celular': parametros.numero
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }



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