'use strict'

var Operador = require('../models/operador');
var moment = require('moment');

function createOperador(req, res) {
    var operador = new Operador();
    var params = req.body;

    console.log("datos: ", params);
    operador.name = params.name;

    console.log(" operador.name: ", operador.name);
    if (params.name) {
        Operador.findOne({ name: operador.name }, (err, opefind) => {
            console.log("ENTRO A  Operador.findOne");
            if (err) {
                res.status(500).send({
                    message: "error"
                });
            } else {

                if (!opefind) {
                    console.log("el entra en !opefind");
                    operador.name = params.name;
                    operador.status = params.status;
                    operador.user = req.user.sub;
                    operador.fcs = moment().format('YYYY MM DD HH:mm:ss');
                    operador.fcs_up = moment().format('YYYY MM DD HH:mm:ss');
                    operador.save((err, operadorStored) => {
                        if (err) {
                            res.status(500).send({ message: 'Error en el servidor' });
                        } else {
                            if (!operadorStored || operadorStored == '') {
                                res.status(404).send({ message: 'No se ha guardado el operador' });
                            } else {
                                console.log("el devuelve el operador");
                                res.status(200).send({ operador: operadorStored });
                            }
                        }
                    });

                } else {
                    res.status(400).send({ message: 'lo siento ya el operador existe' })
                }

            }

        });
    } else {
        res.status(400).send({
            message: 'El nombre del operador es obligatorio'
        })
    }


}

function getOperdores(req, res) {
    Operador.find({}).populate({ path: 'user' }).exec((err, operadores) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la peticion'
            });
        } else {
            if (!operadores || operadores == "") {
                res.status(404).send({
                    message: 'No hay operadores'
                });
            } else {
                res.status(200).send({
                    operadores
                });
            }
        }
    });
}

function getOperador(req, res) {
    var operadorId = req.params.id;
    Operador.findById(operadorId).populate({ path: 'user' }).exec((err, operador) => {
        if (err) {
            res.status(500).send({
                message: 'Error de peticion'
            });
        } else {
            if (!operador) {
                res.status(404).send({
                    message: 'Operador no encontrado'
                });
            } else {
                res.status(200).send({
                        operador
                    }

                );
            }
        }
    });
}

function updateOperador(req, res) {
    var operador = new Operador();
    var operadorId = req.params.id;
    var update = req.body;
    var fecha = update.fcs_up = moment().format('YYYY MM DD HH:mm:ss');

    Operador.findByIdAndUpdate(operadorId, update, { new: true }, (err, updatedOperador) => {


        if (err) {
            res.status(500).send({
                message: 'error de peticion'
            });
        } else {
            if (!updatedOperador) {
                res.status(404).send({
                    message: 'operador no actualizado'
                });
            } else {
                res.status(200).send({
                    operador: updatedOperador
                });
            }
        }
    });
}

function deleteOperador(req, res) {
    var operadorId = req.params.id;
    Operador.findByIdAndRemove(operadorId, (err, operadorDeleted) => {
        if (err) {
            res.status(500).send({
                message: 'error de peticion'
            });
        } else {
            if (!operadorDeleted) {
                res.status(404).send({
                    message: 'Operador no eliminado'
                });
            } else {
                res.status(200).send({
                    operado: operadorDeleted
                });
            }
        }
    });
}
module.exports = {
    createOperador,
    getOperdores,
    getOperador,
    updateOperador,
    deleteOperador
};