'use strict'

// modelos
const Product = require('../models/product');
const Client = require('../models/client');
const peticion = require('../services/peticion');
const Recargas = require('../models/recargas');

function DoRecarga(req, res) {

    var parametros = req.body;

    Product.findOne({ codigo: parametros.producto }, (err, productoDB) => {
        if (err) {
            res.status(500).send({ message: 'Error al verificar producto' });
        } else {
            if (!productoDB) {
                res.status(400).send({ message: 'El producto no existe' });
            } else {

                Client.findById(req.user.sub, (err, cliente_buscado) => {
                    if (parametros.monto && parametros.monto >= 1000) {
                        if (parametros.bolsa) {
                            // verificar de que bolsa se haran las recargas
                            peticion.datosPeticion(res, req, parametros, cliente_buscado, productoDB);

                        } else {
                            res.status(400).send({ message: 'Escoja una bolsa' });
                        }

                    } else {
                        res.status(400).send({ message: 'El monto debe ser mayor a 1000' });
                    }




                });



            }
        }

    });

} // fin de doRecarga




// cliente que quiere saber sus recargas 
function misRecargas(req, res) {

    var cliente = req.user.sub;

    //  Recargas.find({ client: cliente }).populate('client', 'name lastname username').exec((err, infoFound) => {
    Recargas.find({ client: cliente }).populate('producto', 'name').exec((err, infoFound) => {
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

// (Admin)
function allRecargas(req, res) {
    Recargas.find({}).populate({ path: 'client', select: 'name' }).
    populate({ path: 'producto', select: 'name' }).exec((err, infoFound) => {
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

function lastRecargas(req, res) {
    var cliente = req.user.sub;

    Recargas.find({ client: cliente }).sort({ fec_cre: -1 }).limit(5).exec((err, last) => {
        if (err) {
            return res.status(500).send({ message: 'Error interno' });
        } else {
            if (!last) {
                return res.status(400).send({ message: 'No se ha encontrado información' });
            } else {
                return res.status(200).send({ message: last });
            }
        }
    });

}



module.exports = {
    DoRecarga,
    misRecargas,
    allRecargas,
    lastRecargas
};