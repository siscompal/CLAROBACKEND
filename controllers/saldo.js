'use strict'
// modulos
var request = require('request');
var moment = require('moment');

//modelos
var Client = require('../models/client');
var Saldo = require('../models/saldo');
var User = require('../models/user');


function asignar_saldo(req, res) {
    var parametros = req.body;
    var clientId = req.params.id;
    var saldo = new Saldo();
    var usu_cli = req.user.sub;
    saldo.valor = parametros.valor;
    saldo.obs = parametros.obs;
    saldo.cliente = clientId;
    saldo.fec_cre = moment().format('YYYY MM DD HH:mm:ss');

    // buscar usuario que asigna
    User.findById(usu_cli, (err, userFound) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la peticion buscando el usuario'
            });
        } else {
            if (!userFound) {
                // si no encontró usuario que asigna,  buscar cliente que asigna 
                Client.findById(usu_cli, (err, clientFound) => {
                    if (err) {
                        res.status(500).send({
                            message: 'Error en la peticion buscando el cliente'
                        });
                    } else {
                        if (!clientFound) {
                            res.status(404).send({
                                message: ' No se encontro el cliente'
                            });
                        } else {

                            // Buscar si el cliente a asignar existe.
                            Client.findById(saldo.cliente, (err, cliente_buscado) => {
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
                                                        saldo.tipo = "asignado";
                                                        saldo.client_Origen = clientFound.id;
                                                        console.log("cli: ", clientFound.id);
                                                        saldo.save((err, saldoStored) => {
                                                            if (err) {
                                                                res.status(500).send({ message: 'Error en la peticion' });

                                                            } else {
                                                                if (!saldoStored) {
                                                                    res.status(404).send({ message: 'No se ha guardado la asignacion' });
                                                                } else {
                                                                    return res.status(200).send({
                                                                        saldoAsignado: saldoStored,
                                                                        // clienteConSaldo: cliente_consaldo
                                                                    });

                                                                }
                                                            }
                                                        });

                                                    }
                                                }
                                            });
                                        }
                                    }
                                }


                            });
                        }
                    }
                });
            } else { // Si encontro el usuario que asigna 

                // buscamos el cliente a asignar
                Client.findById(saldo.cliente, (err, cliente_buscado) => {
                    if (err) {
                        console.log(clientId);

                        res.status(500).send({
                            message: 'Error en la peticion buscando el cliente'
                        });
                    } else {
                        if (!cliente_buscado) {
                            res.status(404).send({
                                message: 'No se encontro el cliente'
                            });

                        } else { // si cliente a asignar es encontrado

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
                                            saldo.tipo = "asignado";
                                            saldo.user_Origen = userFound._id;
                                            console.log("usu: ", userFound._id);
                                            saldo.save((err, saldoStored) => {
                                                if (err) {
                                                    res.status(500).send({ message: 'Error en la peticion' });

                                                } else {
                                                    if (!saldoStored) {
                                                        res.status(404).send({ message: 'No se ha guardado la asignacion' });
                                                    } else {
                                                        res.status(200).send({
                                                            saldoAsignado: saldoStored,
                                                            //clienteConSaldo: cliente_consaldo
                                                        });

                                                    }
                                                }
                                            });

                                        }
                                    }
                                });
                            }
                        }
                    }


                });
            }
        }
    });


}

function debitar_saldo(req, res) {

    var parametros = req.body;
    var clientId = req.params.id;
    var saldo = new Saldo();
    saldo.valor = req.body.valor;
    saldo.obs = parametros.obs;
    saldo.cliente = clientId;
    saldo.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
    var usu_cli = req.user.sub;

    console.log("parametros del body " + saldo.valor);

    // buscar usuario que debita
    User.findById(usu_cli, (err, userFound) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la peticion buscando el usuario'
            });
        } else {
            if (!userFound) {
                // si no encontro usuario que debita, buscar cliente que debita
                Client.findById(usu_cli, (err, clientFound) => {
                    if (err) {
                        res.status(500).send({
                            message: 'Error en la peticion buscando el cliente'
                        });

                    } else {
                        if (!clientFound) {
                            res.status(404).send({
                                message: 'el cliente no se encontro'
                            });
                        } else { // Si encontro el cliente que debita

                            // Buscar cliente a debitar 
                            Client.findById(saldo.cliente, (err, cliente_buscado) => {
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
                                                Client.findByIdAndUpdate(cliente_buscado.id, { saldo_actual: update, comision_actual: updateComision }, { new: true }, (err, cliente_debitado) => {
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
                                                        if (!cliente_debitado) {
                                                            res.status(404).send({
                                                                message: 'cliente no actualizado'
                                                            });
                                                        } else {
                                                            saldo.tipo = "debitado";
                                                            saldo.client_Origen = clientFound._id;
                                                            console.log("cli: ", clientFound._id);
                                                            saldo.save((err, saldoStored) => {
                                                                if (err) {
                                                                    res.status(500).send({ message: 'Error en la peticion' });

                                                                } else {
                                                                    if (!saldoStored) {
                                                                        res.status(404).send({ message: 'No se ha guardado la asignacion' });
                                                                    } else {
                                                                        res.status(200).send({
                                                                            saldoDebitado: saldoStored,
                                                                            //clienteDebitado: cliente_debitado
                                                                        });

                                                                    }
                                                                }
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
                    } // fin de else !clientFound

                });

            } else { // Si encontro el usuario que debita


                // Buscar  cliente a debitar
                Client.findById(saldo.cliente, (err, cliente_buscado) => {
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

                        } else { // si cliente a debitar es encontrado

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
                                    Client.findByIdAndUpdate(cliente_buscado.id, { saldo_actual: update, comision_actual: updateComision }, { new: true }, (err, cliente_debitado) => {
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
                                            if (!cliente_debitado) {
                                                res.status(404).send({
                                                    message: 'cliente no actualizado'
                                                });
                                            } else {
                                                saldo.tipo = "debitado";
                                                saldo.user_Origen = userFound._id;
                                                console.log("usu: ", userFound._id);
                                                saldo.save((err, saldoStored) => {
                                                    if (err) {
                                                        res.status(500).send({ message: 'Error en la peticion' });

                                                    } else {
                                                        if (!saldoStored) {
                                                            res.status(404).send({ message: 'No se ha guardado la asignacion' });
                                                        } else {
                                                            res.status(200).send({
                                                                message: saldoStored,
                                                                //clienteDebitado: cliente_debitado
                                                            });

                                                        }
                                                    }
                                                });



                                            }
                                        }
                                    });

                                } // else de findByIdAndUpdate
                            } // tercer else
                        } // segundo else
                    } // primer else


                }); // cierre findById

            } // fin else encontro usuario

        } // fin else if(!userFound)

    }); // fin de user.findById 




} // fin funcion

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
                // de bolsa comision para bolsa saldo
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
                    // de bolsa incentivo a saldo
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


                        // de bolsa incentivo a bolsa comision (si bolsa destino es comision)
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

// Solo admin
function getSaldo(req, res) {
    console.log("Show saldo");
    var options = {
        url: process.env.SALDO + '/' + process.env.KEY,
        method: 'GET',
    }

    request(options, function(error, response, body) {
        console.log("llega a request", body);
        if (!error && response.statusCode == 200) {

            console.log(body);
            var nojson = JSON.parse(body);
            console.log("este es el nojson " + nojson.respuesta);
            var respu = nojson.saldo;
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

//Usuarios admin
function allRepartos(req, res) {

    Saldo.find({}).populate({ path: 'cliente', select: 'name role' }).
    populate({ path: 'user_Origen', select: 'name' }).populate({ path: 'client_Origen', select: 'name' }).exec((err, infoFound) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al buscar reportes de saldo',
            });

        }
        if (!infoFound) {
            return res.status(404).send({
                message: 'No se ha encontrado informacion',
            });
        } else {
            return res.status(200).send({
                InfoEncontrada: infoFound
            });
        }
    });

}

// clientes que quieren ver sus saldos.
function misRepartos(req, res) {
    var clientID = req.user.sub;
    Saldo.find({ cliente: clientID }).populate({ path: 'client_Origen', select: 'name' }).populate({ path: 'user_Origen', select: 'name' }).exec((err, infoFound) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al buscar reportes de saldo',
            });

        }
        if (!infoFound) {
            return res.status(404).send({
                message: 'No se ha encontrado informacion',
            });
        } else {
            return res.status(200).send({
                InfoEncontrada: infoFound
            });
        }
    });

}

// mayo y distri que ven los saldos que asignan o debitan a otros clientes
function movRepartos(req, res) {
    var clientId = req.user.sub;
    Saldo.find({ client_Origen: clientId }).populate('cliente', 'name lastname role').exec((err, infoFound) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al buscar reportes de saldo',
            });

        }
        if (!infoFound) {
            return res.status(404).send({
                message: 'No se ha encontrado informacion',
            });
        } else {
            return res.status(200).send({
                InfoEncontrada: infoFound
            });
        }
    });

}

function pruebaSaldo(req, res) {

    var parametros = req.body;
    var clientId = req.params.id;
    var saldo = new Saldo();

    saldo.valor = req.body.valor;
    saldo.obs = parametros.obs;
    saldo.cliente = clientId;
    saldo.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
    saldo.user_Origen = req.user.sub;

    console.log("parametros del body " + saldo.valor);
    // Buscar  cliente a debitar
    Client.findById(saldo.cliente, (err, cliente_buscado) => {
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

            } else { // si cliente a debitar es encontrado

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
                        Client.findByIdAndUpdate(cliente_buscado.id, { saldo_actual: update, comision_actual: updateComision }, { new: true }, (err, cliente_debitado) => {
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
                                if (!cliente_debitado) {
                                    res.status(404).send({
                                        message: 'cliente no actualizado'
                                    });
                                } else {
                                    saldo.tipo = "debitado";
                                    saldo.save((err, saldoStored) => {
                                        if (err) {
                                            res.status(500).send({ message: 'Error en la peticion' });

                                        } else {
                                            if (!saldoStored) {
                                                res.status(404).send({ message: 'No se ha guardado la asignacion' });
                                            } else {
                                                res.status(200).send({
                                                    message: saldoStored,
                                                    //clienteDebitado: cliente_debitado
                                                });

                                            }
                                        }
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



module.exports = {
    asignar_saldo,
    debitar_saldo,
    pasarSaldo,
    getSaldo,
    allRepartos,
    misRepartos,
    pruebaSaldo,
    movRepartos
}