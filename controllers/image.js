'use strict'
// MODULOS
const Imagen = require('../models/image');
const moment = require('moment');


function uploadImage(req, res) {
    // var imagen = new Imagen();
    console.log(req.file);
    res.status(200).send({
        message: "se subió"
    })
}


module.exports = {
    uploadImage,

};