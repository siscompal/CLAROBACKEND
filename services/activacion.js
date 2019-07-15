'use strict'
const request = require('request');
const Activacion = require('../models/activation');
require('dotenv').config();

function peticion(res,id_pdv, iccid, numero, nombre, documento, direccion, _id, fec) {

    const url = "https://docs.google.com/forms/d/e/1FAIpQLSe4kWZZFlTCkfo7lDIaQ280jDC-hvV-Zew0RG27qeAcztpQAA/formResponse";
    const body = {
        "entry.1074654025": id_pdv,
        "entry.1197337678": documento,
        "entry.258981707": nombre,
        "entry.755627074": direccion,
        "entry.2027845255": iccid,
        "entry.1426918924": numero
    };
    /*const options = {
        url: "https://docs.google.com/forms/d/e/1FAIpQLSe4kWZZFlTCkfo7lDIaQ280jDC-hvV-Zew0RG27qeAcztpQAA/formResponse",
        body: JSON.stringify({
            "entry.1074654025": id_pdv,
            "entry.1197337678": documento,
            "entry.258981707": nombre,
            "entry.755627074": direccion,
            "entry.2027845255": iccid,
            "entry.1426918924": numero
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };*/
    
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            Activacion.findByIdAndUpdate(_id, {status: true, fec_sol: fec}, { new: true }, (err, sim) => {
                if (err) {

                    res.status(500).send({
                        message: 'error de peticion'
                    });
                } else {
                    if (!sim){
                        res.status(404).send({
                            message: 'sim no actualizado'
                        });
                    } else {
                        res.status(200).send({
                            message: "Solicitud enviada"
                        })
                    }
                }
            })
        } else {
            res.status(500).send({
                message: "Error al enviar formulario"
            });
        }
    })
}

module.exports = {
    peticion
};
