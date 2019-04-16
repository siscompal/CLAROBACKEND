'use strict'
// modulos
var request = require('request');
var moment = require('moment');

// modelos
var Recarga = require('../models/recargas');
var Product = require('../models/product');
var Client = require('../models/client');

function DoRecarga(req, res) {

    var parametros = req.body;

    Product.findOne({ codigo: parametros.producto }, (err, productoDB) => {
        if (err) {
            res.status(500).send({ message: 'Error al verificar producto' });
        } else {
            if (!productoDB) {
                res.status(400).send({ message: 'El producto no existe' });
            } else {
                var recarga = new Recarga();
                recarga.numero = parametros.numero;
                recarga.monto = parametros.monto;
                // recarga.producto = paramteros.producto;
                recarga.producto = productoDB._id;
                recarga.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
                recarga.fec_upd = moment().format('YYYY MM DD HH:mm:ss');
                recarga.client = req.user.sub; // user es palabra reservada, en este caso no es usuario sino cliente

                var options = {
                    url: 'http://70.38.107.45:8090/recar',
                    body: JSON.stringify({
                        'key': '0177b0974b925',
                        'id': '5781',
                        'monto': parametros.monto,
                        'celular': parametros.numero,
                        'producto': productoDB.codigo
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
                        if (respu.includes("Recarga exitosa")) {

                            // actualizar incentivo
                            Client.findById(recarga.client, (err, cliente_buscado) => {
                                if (err) {

                                    res.status(500).send({
                                        message: 'Error en la peticion buscando el cliente'
                                    });
                                } else {
                                    if (!cliente_buscado) {
                                        res.status(404).send({
                                            message: 'el cliente no se encontro'
                                        });

                                    } else { // si cliente es encontrado

                                        var updateIncentivo = productoDB.incentivo + cliente_buscado.incentivo_actual;

                                        console.log(" incentivo del producto: ", productoDB.incentivo);
                                        console.log("valor del incentivo actual del cliente: ", cliente_buscado.incentivo_actual);
                                        console.log(" incentivo que se va a actualizar: ", updateIncentivo);

                                        Client.findByIdAndUpdate(cliente_buscado.id, { incentivo_actual: updateIncentivo }, { new: true }, (err, cliente_conIncentivo) => {
                                            if (err) {
                                                console.log("i was here");
                                                console.log(clientId);
                                                console.log("cliente: " + cliente_buscado.id);
                                                res.status(500).send({
                                                    message: 'error de peticion'
                                                });
                                            } else {
                                                if (!cliente_conIncentivo) {
                                                    res.status(404).send({
                                                        message: 'cliente no actualizado'
                                                    });
                                                } else {
                                                    recarga.respuesta = nojson.respuesta;
                                                    recarga.save((err, recargaStored) => {
                                                        if (err) {
                                                            res.status(500).send({ message: 'Error en la peticion' });

                                                        } else {
                                                            if (!recargaStored) {
                                                                res.status(404).send({ message: 'No se ha guardado la recarga' });
                                                            } else {
                                                                return res.status(200).send({ respuesta: respu });
                                                            }
                                                        }
                                                    });

                                                    /* res.status(200).send({
                                                         message: 'Saldo guardado',
                                                         clienteConIncentivo: cliente_conIncentivo
                                                     });
                                                     */




                                                }
                                            }
                                        });
                                    }
                                }


                            });



                        } else {
                            recarga.respuesta = nojson.respuesta;
                            recarga.save((err, recargaStored) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error en la peticion' });

                                } else {
                                    if (!recargaStored) {
                                        res.status(404).send({ message: 'No se ha guardado la recarga' });
                                    } else {
                                        return res.status(200).send({ respuesta: respu });
                                    }
                                }
                            });
                        }

                    }

                })
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