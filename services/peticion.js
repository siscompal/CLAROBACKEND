'use strict'
const request = require('request');
const Recarga = require('../models/recargas');
const moment = require('moment');
const Client = require('../models/client');
require('dotenv').config();

function datosPeticion(res, req, parametros, cliente_buscado, productoDB) {

    // ----------------------------------------- BOLSA SALDO -------------------------------------------------//
    if (parametros.bolsa == "saldo") {

        if (parametros.monto <= cliente_buscado.saldo_actual) {
            const recarga = new Recarga();
            recarga.numero = parametros.numero;
            recarga.monto = parametros.monto;
            // recarga.producto = parametros.producto;
            recarga.producto = productoDB._id;
            recarga.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
            recarga.fec_upd = moment().format('YYYY MM DD HH:mm:ss');
            recarga.client = req.user.sub;

            const options = {
                url: process.env.URL,
                body: JSON.stringify({
                    'key': process.env.KEY,
                    'id': process.env.ID,
                    'monto': parametros.monto,
                    'celular': parametros.numero,
                    'producto': productoDB.codigo
                }),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }
            console.log("Estas son las opciones: " + options);

            request(options, function(error, response, body) {
                    console.log("Entró a request", body);
                    if (!error && response.statusCode == 200) {

                        console.log("Este es el body " + body);
                        var nojson = JSON.parse(body);
                        console.log("este es el nojson " + nojson.respuesta);
                        var respu = nojson.respuesta;
                       // res.status(200).send({ respuesta: respu });
                        
                        // var respu = "Recarga exitosa";

                        if (respu.includes("Recarga exitosa")) {

                            if (productoDB.codigo == "1") {

                                var updateSaldo = cliente_buscado.saldo_actual - parametros.monto;
                                var updateIncentivo = productoDB.incentivo + cliente_buscado.incentivo_actual;

                                console.log(" incentivo del producto: ", productoDB.incentivo);
                                console.log("valor del incentivo actual del cliente: ", cliente_buscado.incentivo_actual);
                                console.log(" incentivo que se va a actualizar: ", updateIncentivo);
                                console.log("saldo actual del cliente: ", cliente_buscado.saldo_actual);
                                console.log(" saldo que se va a actualizar: ", updateSaldo);

                                Client.findByIdAndUpdate(cliente_buscado.id, { incentivo_actual: updateIncentivo, saldo_actual: updateSaldo }, { new: true }, (err, clienteSaldoeIncentivo) => {
                                    if (err) {

                                        res.status(500).send({
                                            message: 'error de peticion'
                                        });
                                    } else {
                                        if (!clienteSaldoeIncentivo) {
                                            res.status(404).send({
                                                message: 'cliente no actualizado'
                                            });
                                        } else {
                                            recarga.respuesta = respu;
                                            recarga.save((err, recargaStored) => {
                                                if (err) {
                                                    res.status(500).send({ message: 'Error en la peticion' });

                                                } else {
                                                    if (!recargaStored) {
                                                        res.status(404).send({ message: 'No se ha guardado la recarga' });
                                                    } else {
                                                        res.status(200).send({ respuesta: respu });

                                                    }
                                                }
                                            });

                                            /* res.status(200).send({
                                                 message: 'Saldo guardado',
                                                 clienteConIncentivo: clienteSaldoeIncentivo
                                             });
                                             */

                                        }
                                    }
                                });
                            } else {
                                var updateSaldo = cliente_buscado.saldo_actual - productoDB.precio;
                                var updateIncentivo = productoDB.incentivo + cliente_buscado.incentivo_actual;

                                console.log(" incentivo del producto: ", productoDB.incentivo);
                                console.log("valor del incentivo actual del cliente: ", cliente_buscado.incentivo_actual);
                                console.log(" incentivo que se va a actualizar: ", updateIncentivo);
                                console.log("saldo actual del cliente: ", cliente_buscado.saldo_actual);
                                console.log(" saldo que se va a actualizar: ", updateSaldo);

                                Client.findByIdAndUpdate(cliente_buscado.id, { incentivo_actual: updateIncentivo, saldo_actual: updateSaldo }, { new: true }, (err, clienteSaldoeIncentivo) => {
                                    if (err) {

                                        res.status(500).send({
                                            message: 'error de peticion'
                                        });
                                    } else {
                                        if (!clienteSaldoeIncentivo) {
                                            res.status(404).send({
                                                message: 'cliente no actualizado'
                                            });
                                        } else {
                                            recarga.respuesta = respu;
                                            recarga.save((err, recargaStored) => {
                                                if (err) {
                                                    res.status(500).send({ message: 'Error en la peticion' });

                                                } else {
                                                    if (!recargaStored) {
                                                        res.status(404).send({ message: 'No se ha guardado la recarga' });
                                                    } else {
                                                        res.status(200).send({ respuesta: respu });

                                                    }
                                                }
                                            });

                                            /* res.status(200).send({
                                                 message: 'Saldo guardado',
                                                 clienteConIncentivo: clienteSaldoeIncentivo
                                             });
                                             */

                                        }
                                    }
                                });
                            }


                            // --------- SI RECARGA FALLIDA AUN GUARDA BOLSA SALDO -----------//
                        } else {
                            recarga.respuesta = nojson.respuesta;
                            recarga.save((err, recargaStored) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error en la peticion' });

                                } else {
                                    if (!recargaStored) {
                                        res.status(404).send({ message: 'No se ha guardado la recarga' });
                                    } else {
                                        return res.status(404).send({ respuesta: respu });
                                    }
                                }
                            });
                        }

                    }

                }) // fin request

            // fin primer if de saldo
        } else {
            res.status(400).send({ message: 'Bolsa de saldo insuficiente' });
        }
        // ---------------------------------------------- FIN BOLSA SALDO ---------------------------------------//

        // ------------------------------------------------ BOLSA COMISION --------------------------------------//
    } else if (parametros.bolsa == "comision") {

        if (parametros.monto <= cliente_buscado.comision_actual) {
            var recarga = new Recarga();
            recarga.numero = parametros.numero;
            recarga.monto = parametros.monto;
            // recarga.producto = parametros.producto;
            recarga.producto = productoDB._id;
            recarga.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
            recarga.fec_upd = moment().format('YYYY MM DD HH:mm:ss');
            recarga.client = req.user.sub;

            var options = {
                url: process.env.URL,
                body: JSON.stringify({
                    'key': process.env.KEY,
                    'id': process.env.ID,
                    'monto': parametros.monto,
                    'celular': parametros.numero,
                    'producto': productoDB.codigo
                }),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }

            request(options, function(error, response, body) {
                    console.log("Entró a request", body);
                    if (!error && response.statusCode == 200) {

                        console.log(body);
                        var nojson = JSON.parse(body);
                        console.log("este es el nojson " + nojson.respuesta);
                        var respu = nojson.respuesta;

                        if (respu.includes("Recarga exitosa")) {
                            // SI ES RECARGA 
                            if (productoDB.codigo == "1") {
                                var updateComision = cliente_buscado.comision_actual - parametros.monto;
                                var updateIncentivo = productoDB.incentivo + cliente_buscado.incentivo_actual;

                                console.log(" incentivo del producto: ", productoDB.incentivo);
                                console.log("valor del incentivo actual del cliente: ", cliente_buscado.incentivo_actual);
                                console.log(" incentivo que se va a actualizar: ", updateIncentivo);
                                console.log("Comision actual del cliente: ", cliente_buscado.comision_actual);
                                console.log(" Comision que se va a actualizar: ", updateComision);

                                Client.findByIdAndUpdate(cliente_buscado.id, { incentivo_actual: updateIncentivo, comision_actual: updateComision }, { new: true }, (err, clienteComisioneIncentivo) => {
                                    if (err) {

                                        res.status(500).send({
                                            message: 'error de peticion'
                                        });
                                    } else {
                                        if (!clienteComisioneIncentivo) {
                                            res.status(404).send({
                                                message: 'cliente no actualizado'
                                            });
                                        } else {
                                            recarga.respuesta = respu;
                                            recarga.save((err, recargaStored) => {
                                                if (err) {
                                                    res.status(500).send({ message: 'Error en la peticion' });

                                                } else {
                                                    if (!recargaStored) {
                                                        res.status(404).send({ message: 'No se ha guardado la recarga' });
                                                    } else {
                                                        res.status(200).send({ respuesta: respu });

                                                    }
                                                }
                                            });

                                            /* res.status(200).send({
                                                 message: 'Saldo guardado',
                                                 clienteConIncentivo: clienteComisioneIncentivo
                                             });
                                             */

                                        }
                                    }
                                });
                            } else {
                                var updateComision = cliente_buscado.comision_actual - productoDB.precio;
                                var updateIncentivo = productoDB.incentivo + cliente_buscado.incentivo_actual;

                                console.log(" incentivo del producto: ", productoDB.incentivo);
                                console.log("valor del incentivo actual del cliente: ", cliente_buscado.incentivo_actual);
                                console.log(" incentivo que se va a actualizar: ", updateIncentivo);
                                console.log("Comision actual del cliente: ", cliente_buscado.comision_actual);
                                console.log(" Comision que se va a actualizar: ", updateComision);

                                Client.findByIdAndUpdate(cliente_buscado.id, { incentivo_actual: updateIncentivo, comision_actual: updateComision }, { new: true }, (err, clienteComisioneIncentivo) => {
                                    if (err) {

                                        res.status(500).send({
                                            message: 'error de peticion'
                                        });
                                    } else {
                                        if (!clienteComisioneIncentivo) {
                                            res.status(404).send({
                                                message: 'cliente no actualizado'
                                            });
                                        } else {
                                            recarga.respuesta = respu;
                                            recarga.save((err, recargaStored) => {
                                                if (err) {
                                                    res.status(500).send({ message: 'Error en la peticion' });

                                                } else {
                                                    if (!recargaStored) {
                                                        res.status(404).send({ message: 'No se ha guardado la recarga' });
                                                    } else {
                                                        res.status(200).send({ respuesta: respu });

                                                    }
                                                }
                                            });

                                            /* res.status(200).send({
                                                 message: 'Saldo guardado',
                                                 clienteConIncentivo: clienteSaldoeIncentivo
                                             });
                                             */

                                        }
                                    }
                                });
                            }

                        } else {
                            recarga.respuesta = nojson.respuesta;
                            recarga.save((err, recargaStored) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error en la peticion' });

                                } else {
                                    if (!recargaStored) {
                                        res.status(404).send({ message: 'No se ha guardado la recarga' });
                                    } else {
                                        return res.status(404).send({ respuesta: respu });
                                    }
                                }
                            });
                        }

                    }

                }) // fin request

            // fin primer if de comision
        } else {
            res.status(400).send({ message: 'Saldo de comision insuficiente' });
        }
        // ---------------------------------------------- FIN BOLSA COMISION -----------------------------------//

        // ------------------------------------------------- BOLSA INCENTIVO -----------------------------------//
    } else {
        if (parametros.monto <= cliente_buscado.incentivo_actual) {
            var recarga = new Recarga();
            recarga.numero = parametros.numero;
            recarga.monto = parametros.monto;
            // recarga.producto = paramteros.producto;
            recarga.producto = productoDB._id;
            recarga.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
            recarga.fec_upd = moment().format('YYYY MM DD HH:mm:ss');
            recarga.client = req.user.sub;

            var options = {
                url: process.env.URL,
                body: JSON.stringify({
                    'key': process.env.KEY,
                    'id': process.env.ID,
                    'monto': parametros.monto,
                    'celular': parametros.numero,
                    'producto': productoDB.codigo
                }),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }

            request(options, function(error, response, body) {
                    console.log("Entró a request", body);
                    if (!error && response.statusCode == 200) {

                        console.log(body);
                        var nojson = JSON.parse(body);
                        console.log("este es el nojson " + nojson.respuesta);
                        var respu = nojson.respuesta;
                        
                        if (respu.includes("Recarga exitosa")) {
                            // SI ES RECARGA
                            if (productoDB.codigo == "1") {

                                var updateIncentivo = cliente_buscado.incentivo_actual - parametros.monto + productoDB.incentivo;


                                console.log(" incentivo del producto: ", productoDB.incentivo);
                                console.log("valor del incentivo actual del cliente: ", cliente_buscado.incentivo_actual);
                                console.log(" Incentivo que se va a actualizar: ", updateIncentivo);



                                Client.findByIdAndUpdate(cliente_buscado.id, { incentivo_actual: updateIncentivo }, { new: true }, (err, clienteConIncentivo) => {
                                    if (err) {

                                        res.status(500).send({
                                            message: 'error de peticion'
                                        });
                                    } else {
                                        if (!clienteConIncentivo) {
                                            res.status(404).send({
                                                message: 'cliente no actualizado'
                                            });
                                        } else {
                                            recarga.respuesta = respu;
                                            recarga.save((err, recargaStored) => {
                                                if (err) {
                                                    res.status(500).send({ message: 'Error en la peticion' });

                                                } else {
                                                    if (!recargaStored) {
                                                        res.status(404).send({ message: 'No se ha guardado la recarga' });
                                                    } else {
                                                        res.status(200).send({ respuesta: respu });

                                                    }
                                                }
                                            });

                                            /* res.status(200).send({
                                                 message: 'Saldo guardado',
                                                 clienteConIncentivo: clienteConIncentivo
                                             });
                                             */

                                        }
                                    }
                                });
                            } else {

                                var updateIncentivo = cliente_buscado.incentivo_actual - parametros.monto + productoDB.incentivo;

                                console.log(" incentivo del producto: ", productoDB.incentivo);
                                console.log("valor del incentivo actual del cliente: ", cliente_buscado.incentivo_actual);
                                console.log(" Incentivo que se va a actualizar: ", updateIncentivo);

                                Client.findByIdAndUpdate(cliente_buscado.id, { incentivo_actual: updateIncentivo }, { new: true }, (err, clienteConIncentivo) => {
                                    if (err) {

                                        res.status(500).send({
                                            message: 'error de peticion'
                                        });
                                    } else {
                                        if (!clienteConIncentivo) {
                                            res.status(404).send({
                                                message: 'cliente no actualizado'
                                            });
                                        } else {
                                            recarga.respuesta = respu;
                                            recarga.save((err, recargaStored) => {
                                                if (err) {
                                                    res.status(500).send({ message: 'Error en la peticion' });

                                                } else {
                                                    if (!recargaStored) {
                                                        res.status(404).send({ message: 'No se ha guardado la recarga' });
                                                    } else {
                                                        res.status(200).send({ respuesta: respu });

                                                    }
                                                }
                                            });

                                            /* res.status(200).send({
                                                 message: 'Saldo guardado',
                                                 clienteConIncentivo: clienteSaldoeIncentivo
                                             });
                                             */

                                        }
                                    }
                                });
                            }


                        } else {
                            recarga.respuesta = nojson.respuesta;
                            recarga.save((err, recargaStored) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error en la peticion' });

                                } else {
                                    if (!recargaStored) {
                                        res.status(404).send({ message: 'No se ha guardado la recarga' });
                                    } else {
                                        return res.status(404).send({ respuesta: respu });
                                    }
                                }
                            });
                        }

                    }

                }) // fin request


        } else {
            res.status(400).send({ message: 'Saldo de incentivo insuficiente' });
        }
    }
    // -------------------------------------------------- FIN BOLSA INCENTIVO -------------------------------//
}

module.exports = {
    datosPeticion
};
