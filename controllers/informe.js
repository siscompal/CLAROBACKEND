'use strict'

// var Client = require('../models/client');
var Recargas = require('../models/recargas');

function listarRecargas(req, res) {

    var cliente = req.user.sub;

    Recargas.find({ client: cliente }).populate('client', 'name').exec((err, infoFound) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al buscar recarga',
            });

        } else {
            if (!infoFound) {
                return res.status(404).send({
                    message: 'No se ha encontrado informacion',
                });
            } else {
                return res.status(200).send({
                    InfoEncontrada: infoFound
                });
            }
        }

    });



}


function allRecargas(req, res) {
    Recargas.find({}).populate('client', 'name').exec((err, infoFound) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al buscar recarga',
            });

        } else {
            if (!infoFound) {
                return res.status(404).send({
                    message: 'No se ha encontrado informacion',
                });
            } else {
                return res.status(200).send({
                    InfoEncontrada: infoFound
                });
            }
        }

    });

}





module.exports = {
    listarRecargas,
    allRecargas

}