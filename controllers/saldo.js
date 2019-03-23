'use strict'
//     console.log();
//hora
var moment = require('moment');

//modelos
var Cliente = require('../../models/cliente');
var Saldo = require('../../models/saldo');
//fin modelos

function asignar_saldo(req, res) {
    var parametros = req.body;
    var saldo = new Saldo();
    var cliente = new Cliente();
    saldo.valor = parametros.valor;
    saldo.fcs = moment().format('YYYY MM DD HH:mm:ss');
    saldo.obs = parametros.obs;
    //saldo.cliente = params.user._id;
    saldo.cliente = parametros.id_cliente;

    // Buscar si el cliente exite.
    Cliente.findById(saldo.cliente, (err, cliente_buscado) => {
        if (err) {
            res.status(500).send({
                message: 'error en la peticion'
            });
        } else {
            if (!cliente_buscado) {
                res.status(404).send({
                    message: 'el cliente no se encontro'
                });

            } else {

                if (saldo.valor <= 20000) {
                    res.status(200).send({
                        message: 'el valor no se puede asignar debe ser mayor a 20000'
                    });
                } else {
                    //cuando todo esta ok
                    /*console.log("-------------------// este es ID ", cliente_buscado._id, "//------------------------");
                      console.log("valor que viene de postman", saldo.valor);
                      console.log("valor que viene de cliente", cliente_buscado.saldo_actual); */
                    //console.log(" valor que se va a actualizar : update", update);

                    // --------------------------------OPERACIONES -------------------------------------------------//
                    var porcen_decimal = cliente_buscado.porc / 100;
                    var operacion = saldo.valor * porcen_decimal;
                    saldo.comision = operacion;
                    var update = cliente_buscado.saldo_actual + saldo.valor + operacion;

                    Cliente.findByIdAndUpdate(cliente_buscado._id, { saldo_actual: update }, { new: true }, (err, Cliente_consaldo) => {
                        if (err) {
                            res.status(500).send({
                                message: 'error de peticion'
                            });
                        } else {
                            if (!Cliente_consaldo) {
                                res.status(404).send({
                                    message: 'cliente no actualizado'
                                });
                            } else {
                                // guardar en la base de datos
                                saldo.save((err, saldo_db) => {
                                    if (err) {
                                        res.status(500).send({ message: 'Error en el servidor' });
                                    } else {
                                        if (!saldo_db) {
                                            res.status(404).send({ message: 'No se ha guardado el saldo' });
                                        } else {

                                            res.status(200).send({ cliente: Cliente_consaldo });
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




module.exports = {
    asignar_saldo
}