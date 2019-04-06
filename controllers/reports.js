'use strict'
//var Reportar = require('../models/reportar');

//var User = require('../models/user');

var moment = require('moment');


function saveReportar(req, res) {
    var reportar = new Reportar();
    var params = req.body;
    // Validar parametros
    if (params.banco && params.nom_sucur && params.num_sucur && params.num_vol && params.val && params.rol) {


        //Buscar Banco por Id
        Banco.findOne({ name: params.banco }, (err, bancoFinded) => {
            console.log("aqui 1");
            if (err) {
                res.status(500).send({
                    message: "Error en la peticion"
                });
            } else {
                if (!bancoFinded) {
                    res.status(404).send({
                        message: "Banco no encontrado"
                    });
                } else {

                    if (params.rol == 'CONSIGNACION') {
                        console.log("aqui");
                        reportar.banco = bancoFinded._id;
                        reportar.nom_sucur = params.nom_sucur;
                        reportar.num_sucur = params.num_sucur;
                        reportar.num_vol = params.num_vol;
                        reportar.val = params.val;
                        reportar.rol = params.rol;
                        reportar.img = null;
                        reportar.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
                        reportar.fec_up = moment().format('YYYY MM DD HH:mm:ss');
                        reportar.save((err, reportarSaved) => {
                            if (err) {
                                res.status(500).send({
                                    message: "Error en la peticion consignacion"
                                });
                            } else {
                                if (!reportarSaved) {
                                    res.status(404).send({
                                        message: "No se pudo guardar reporte"
                                    });
                                } else {
                                    console.log("aqui");
                                    res.status(200).send({
                                        reporte: reportarSaved
                                    });
                                }
                            }
                        })
                    } else {
                        // Guardar si es transferencia
                        if (req.files) {
                            var file_path = req.files.image.path;
                            var file_split = file_path.split('/');
                            var file_name = file_split[2];
                            var ext_split = file_name.split('\.');
                            var file_ext = ext_split[1];

                            if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg') {
                                reportar.banco = params.banco;
                                reportar.nom_sucur = null;
                                reportar.num_sucur = null;
                                reportar.num_vol = null;
                                reportar.val = params.val;
                                reportar.rol = params.rol;
                                reportar.img = file_name;
                                reportar.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
                                reportar.fec_up = moment().format('YYYY MM DD HH:mm:ss');
                                reportar.save((err, reportarSaved) => {
                                    if (err) {
                                        console.log("va mal");
                                        res.status(500).send({
                                            message: "Error en la peticion"
                                        });
                                    } else {
                                        if (!reportarSaved) {
                                            res.status(404).send({
                                                message: "No se pudo guardar reporte"
                                            });
                                        } else {
                                            console.log("va bien");

                                            res.status(200).send({
                                                reporte: reportarSaved
                                            });
                                        }
                                    }
                                });

                            } else {
                                res.status(404).send({
                                    message: "Extension no valida"
                                });
                            }



                        } else {
                            res.status(404).send({
                                message: "No se ha subido archivos"
                            });
                        }
                    }

                }
            }
        });
    } else {
        res.status(404).send({
            message: "Campos incompletos"
        });
    }

}

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
    saveReportar,
    getReportes,
    getReporte

}