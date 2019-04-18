'use strict'
//     console.log();
//hora
var moment = require('moment');

//modelos
var Client = require('../models/client');
var Saldo = require('../models/saldo');
//fin modelos

function asignar_saldo(req, res) {
    var parametros = req.body;
    var clientId = req.params.id;
    var saldo = new Saldo();
    saldo.valor = parametros.valor;
    saldo.obs = parametros.obs;
    saldo.client = clientId;
    saldo.fcs = moment().format('YYYY MM DD HH:mm:ss');

    // Buscar si el cliente exite.
    Client.findById(saldo.client, (err, cliente_buscado) => {
        if (err) {
            console.log(clientId);

            res.status(500).send({
                message: 'Error en la peticion buscando el cliente'
            });
        } else {
            if (!cliente_buscado) {
                res.status(404).send({
                    message: 'el cliente no se encontro'
                });

            } else { // si cliente es encontrado

                if (saldo.valor <= 20000) {
                    res.status(200).send({
                        message: 'El valor debe ser mayor a 20000'
                    });
                } else {
                    //cuando todo esta ok
                    console.log("-------------------// este es ID ", cliente_buscado._id, "//------------------------");
                    console.log("valor que viene de postman", saldo.valor);
                    console.log("valor que viene de cliente", cliente_buscado.saldo_actual);


                    // --------------------------------OPERACIONES -------------------------------------------------//
                    var porcen = cliente_buscado.porcentaje / 100;
                    var comisionNeta = saldo.valor * porcen;
                    saldo.comision = comisionNeta;
                    var update = cliente_buscado.saldo_actual + saldo.valor;
                    var updateComision = cliente_buscado.comision_actual + comisionNeta;
                    console.log(" saldo que se va a actualizar : saldo", update);
                    console.log(" comision que se va a actualizar : comision", updateComision);

                    Client.findByIdAndUpdate(cliente_buscado.id, { saldo_actual: update, comision_actual: updateComision }, { new: true }, (err, cliente_consaldo) => {
                        if (err) {
                            console.log("i was here");
                            console.log(clientId);
                            console.log("cliente: " + cliente_buscado.id);
                            res.status(500).send({
                                message: 'error de peticion'
                            });
                        } else {
                            if (!cliente_consaldo) {
                                res.status(404).send({
                                    message: 'cliente no actualizado'
                                });
                            } else {

                                res.status(200).send({
                                    message: 'Saldo guardado',
                                    clienteConSaldo: cliente_consaldo
                                });

                            }
                        }
                    });
                }
            }
        }


    });

}

function debitar_saldo(req, res) {

    var parametros = req.body;
    var clientId = req.params.id;
    var saldo = new Saldo();

    saldo.valor = req.body.valor;

    console.log("parametros del body " + saldo.valor);
    saldo.obs = parametros.obs;
    saldo.client = clientId;
    saldo.fcs = moment().format('YYYY MM DD HH:mm:ss');

    // Buscar si el cliente exite.
    Client.findById(saldo.client, (err, cliente_buscado) => {
        if (err) {
            console.log(clientId);

            res.status(500).send({
                message: 'Error en la peticion buscando el cliente'
            });
        } else {
            if (!cliente_buscado) {
                res.status(404).send({
                    message: 'el cliente no se encontro'
                });

            } else { // si cliente es encontrado

                if (saldo.valor >= cliente_buscado.saldo_actual || saldo.valor <= 0) {
                    res.status(200).send({
                        message: 'Valor no permitido'
                    });
                } else {
                    //cuando todo esta ok
                    console.log("---------// este es ID ", cliente_buscado._id, "//-------");
                    console.log("valor que viene de postman", saldo.valor);
                    console.log("valor que viene de cliente", cliente_buscado.saldo_actual);
                    // --------------------------------OPERACIONES -------------------------------------------------//

                    var porcen = cliente_buscado.porcentaje / 100;
                    var comisionNeta = saldo.valor * porcen;
                    saldo.comision = comisionNeta;
                    var update = cliente_buscado.saldo_actual - saldo.valor;
                    var updateComision = cliente_buscado.comision_actual - comisionNeta;


                    console.log(" saldo que se va a  debitar : saldo", update);
                    console.log(" comision que se va a debitar : comision", updateComision);

                    if (update <= 0) {
                        res.status(200).send({
                            message: 'El valor es erroneo'
                        });
                    } else {
                        Client.findByIdAndUpdate(cliente_buscado.id, { saldo_actual: update, comision_actual: updateComision }, { new: true }, (err, clienteDebitado) => {
                            if (err) {
                                // console.log("i was here");
                                // console.log("id de cliente: " + clientId);
                                console.log("Saldo actual: " + cliente_buscado.saldo_actual);
                                console.log("saldo por parametros: " + saldo.valor);
                                // console.log("cliente: " + cliente_buscado.id);
                                res.status(500).send({
                                    message: 'error de peticion'
                                });
                            } else {
                                if (!clienteDebitado) {
                                    res.status(404).send({
                                        message: 'cliente no actualizado'
                                    });
                                } else {

                                    res.status(200).send({
                                        message: 'Saldo guardado',
                                        clienteDebitado: clienteDebitado
                                    });

                                }
                            }
                        });

                    } // else de findByIdAndUpdate
                } // tercer else
            } // segundo else
        } // primer else


    }); // cierre findById

}

function pasarSaldo(req, res) {

    var parametros = req.body;
    var bolsa_origen = parametros.origen;
    var bolsa_destino = parametros.destino;
    var cliente = req.user.sub;

    Client.findById(cliente, (err, cliente_buscado) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al buscar cliente',
            });
        } else {
            if (!cliente_buscado) {
                return res.status(404).send({
                    message: 'No se ha encontrar el cliente',
                });
            } else {

                if (bolsa_origen == "comision") {
                    var updateComision = cliente_buscado.comision_actual - cliente_buscado.comision_actual;
                    var updateSaldo = cliente_buscado.saldo_actual + cliente_buscado.comision_actual;

                    console.log("comision actual " + cliente_buscado.comision_actual);
                    console.log("csaldo actual " + cliente_buscado.saldo_actual);
                    console.log("comision a actualizar " + updateComision);
                    console.log("saldo a actualizar " + updateSaldo);

                    Client.findByIdAndUpdate(cliente, { saldo_actual: updateSaldo, comision_actual: updateComision }, { new: true }, (err, clienteBagUpdated) => {
                        if (err) {
                            return res.status(500).send({
                                message: 'Error al actualizar bolsa',
                            });
                        } else {
                            if (!clienteBagUpdated) {
                                return res.status(404).send({
                                    message: 'No se ha podido realizar operacion',
                                });
                            } else {
                                return res.status(200).send({
                                    message: 'Bolsa actualizada correctamente',
                                    clienteBagUpdated: clienteBagUpdated
                                });

                            }
                        }
                    });
                } else if (bolsa_origen == "incentivo") {
                    if (bolsa_destino == "saldo") {

                        var updateIncentivo = cliente_buscado.incentivo_actual - cliente_buscado.incentivo_actual;
                        var updateSaldo = cliente_buscado.saldo_actual + cliente_buscado.incentivo_actual;

                        Client.findByIdAndUpdate(cliente, { saldo_actual: updateSaldo, incentivo_actual: updateIncentivo }, { new: true }, (err, clienteBagUpdated) => {
                            if (err) {
                                return res.status(500).send({
                                    message: 'Error al actualizar bolsa',
                                });
                            } else {
                                if (!clienteBagUpdated) {
                                    return res.status(404).send({
                                        message: 'No se ha podido realizar operacion',
                                    });
                                } else {
                                    return res.status(200).send({
                                        message: 'Bolsa actualizada correctamente',
                                        clienteBagUpdated: clienteBagUpdated
                                    });

                                }
                            }
                        });


                        // si bolsa destino es comision
                    } else {
                        var updateIncentivo = cliente_buscado.incentivo_actual - cliente_buscado.incentivo_actual;
                        var updateComision = cliente_buscado.comision_actual + cliente_buscado.incentivo_actual;

                        Client.findByIdAndUpdate(cliente, { incentivo_actual: updateIncentivo, comision_actual: updateComision }, { new: true }, (err, clienteBagUpdated) => {
                            if (err) {
                                return res.status(500).send({
                                    message: 'Error al actualizar bolsa',
                                });
                            } else {
                                if (!clienteBagUpdated) {
                                    return res.status(404).send({
                                        message: 'No se ha podido realizar operacion',
                                    });
                                } else {
                                    return res.status(200).send({
                                        message: 'Bolsa actualizada correctamente',
                                        clienteBagUpdated: clienteBagUpdated
                                    });

                                }
                            }
                        });

                    }

                }

            }
        }


    });

}


module.exports = {
    asignar_saldo,
    debitar_saldo,
    pasarSaldo
}