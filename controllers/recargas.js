'use strict'
// modulos
var request = require('request');


// modelos
var Product = require('../models/product');
var Client = require('../models/client');
var peticion = require('../services/peticion');

function DoRecarga(req, res) {

    var parametros = req.body;

    Product.findOne({ codigo: parametros.producto }, (err, productoDB) => {
        if (err) {
            res.status(500).send({ message: 'Error al verificar producto' });
        } else {
            if (!productoDB) {
                res.status(400).send({ message: 'El producto no existe' });
            } else {

                Client.findById(req.user.sub, (err, cliente_buscado) => {
                    if (parametros.monto && parametros.monto >= 1000) {
                        if (parametros.bolsa) {
                            // verificar de que bolsa se haran las recargas
                            peticion.datosPeticion(res, req, parametros, cliente_buscado, productoDB);


                        } else {
                            res.status(400).send({ message: 'Escoja una bolsa' });
                        }

                    } else {
                        res.status(400).send({ message: 'El monto debe ser mayor a 1000' });
                    }




                });



            }
        }

    });



} // fin de doRecarga


function getSaldo(req, res) {
    console.log("Show saldo");
    var options = {
        url: 'http://70.38.107.45:8090/misald/5781/0177b0974b925',
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