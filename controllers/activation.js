'use strict'
// MODULOS
const Activacion = require('../models/activation');
const moment = require('moment');
const activacion = require('../services/activacion.js');

function createSim(req, res) {
    var activacion = new Activacion();

    var parametros = req.body;

    if (parametros.id_pdv && parametros.numero && parametros.iccid) {
        // setteo las variables
        activacion.id_pdv = parametros.id_pdv;
        activacion.numero = parametros.numero;
        activacion.iccid = parametros.iccid;
        activacion.status = false;
        activacion.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
       
       
        Activacion.findOne({ numero: parametros.numero }, (err, simDB) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar la sim' });
            } else {
                if (!simDB) {
                    activacion.save((err, simStored) => {
                        if (err) {
                            res.status(500).send({ message: 'Error en el servidor' });
                        } else {
                            if (!simStored) {
                                res.status(404).send({ message: 'No se ha guardado la sim' });
                            } else {
                                res.status(200).send({ sim: simStored });

                            }
                        }
                    });
                } else {
                    res.status(500).send({ message: 'Sim existente' });
                }

            }
        });

    } else {
        res.status(200).send({ message: 'Todos los campos son obligatorios' });
    }

}

// listar todos los productos (admin)

function getSims(req, res) {
    Activacion.find({}).exec((err, sims) => {
        
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!sims) {
                res.status(404).send({ message: 'No hay Sim' });
            } else {
                res.status(200).send({ sims });
            }
        }
    });
}


// obtener un solo produto (admin)
function getSim(req, res) {
    var simId = req.params.id;

    Activacion.findById(simId).exec((err, sim) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!sim) {
                res.status(404).send({ message: 'No existe la sim' });
            } else {
                res.status(200).send({ sim });
            }
        }
    });
}


function updateSim(req, res) {

    var simId = req.params.id;
    var update = req.body;

    Activacion.findByIdAndUpdate(simId, update, { new: true }, (err, simUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!simUpdated) {
                res.status(404).send({ message: 'No se ha actualizado la sim' });
            } else {
                res.status(200).send({ Sim: simUpdated });
            }
        }
    });
}

function activateSim(req, res) {

    var parametros = req.body;
    var fec_sol = moment().format('YYYY MM DD HH:mm:ss');
    Activacion.findOne({ numero: parametros.numero }, (err, simDB) => {
        if (err) {
            res.status(500).send({ message: 'Error al verificar sim' });
        } else {
            if (!simDB) {
                res.status(400).send({ message: 'La sim no existe' });
            } else {
                activacion.peticion(res,parametros.id_pdv, parametros.iccid, parametros.numero, parametros.nombre, parametros.documento, parametros.direccion, parametros._id, fec_sol);
            }
        }

    });

}


module.exports = {
    createSim,
    getSims,
    getSim,
    updateSim,
    activateSim
};