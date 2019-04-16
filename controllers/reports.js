'use strict'

//var User = require('../models/user');

var moment = require('moment');


function getReportes(req, res) {
    Reportar.find({}).populate({ path: 'banco' }).populate({ path: 'user' }).exec((err, reportes) => {
        if (err) {
            res.status(500).send({
                message: "Error en la peticion"
            });
        } else {
            if (!reportes) {
                res.status(404).send({
                    message: "Reportes no encontrados"
                });
            } else {
                res.status(200).send({
                    reportes
                });
            }
        }
    })

}

function getReporte(req, res) {
    var reporteId = req.params.id;

    Reportar.findById(reporteId).populate({ path: 'banco' }).populate({ path: user }).exec((err, reporte) => {
        if (err) {
            res.status(500).send({
                message: "Error en la peticion"
            });
        } else {
            if (!reporte) {
                res.status(404).send({
                    message: "Reporte no encontrado"
                });
            } else {
                res.status(200).send({
                    reporte
                });
            }
        }
    })

}



module.exports = {
    getReportes,
    getReporte

}