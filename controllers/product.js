'use strict'
// MODULOS

var moment = require('moment');

//MODELOS
var User = require('../models/user');
var Product = require('../models/product');

// servicios jwt 
// var jwt = require('../services/jwt');

//ACCIONES O METODOS
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de producto',
        user: req.user
    });

}

function createProduct(req, res) {
    var product = new Product();

    var parametros = req.body;



    if (parametros.name && parametros.precio && parametros.codigo && parametros.status && parametros.descripcion) {
        // setteo las variables
        product.name = parametros.name;
        product.precio = parametros.precio;
        product.codigo = parametros.codigo;
        product.status = parametros.status;
        product.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
        product.fec_upd = moment().format('YYYY MM DD HH:mm:ss');
        product.user = req.user.sub; //  req.user.sub para guardar el id del usuario logueado
        product.incentivo = parametros.incentivo;
        product.descripcion = parametros.descripcion;

        Product.findOne({ codigo: parametros.codigo.toLowerCase() }, (err, productoDB) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar producto' });
            } else {
                if (!productoDB) {
                    product.save((err, productStored) => {
                        if (err) {
                            res.status(500).send({ message: 'Error en el servidor' });
                        } else {
                            if (!productStored) {
                                res.status(404).send({ message: 'No se ha guardado el producto' });
                            } else {
                                res.status(200).send({ productoGuardado: productStored });
                            }
                        }
                    });
                } else {
                    res.status(200).send({ message: 'Producto existente' });
                }

            }
        });
    } else {
        res.status(200).send({ message: 'Todos los campos son obligatorios' });
    }

}

// listar todos los productos
function getProducts(req, res) {
    Product.find({}).populate({ path: 'user' }).exec((err, products) => {
        // .populate('usuario', 'nombre apellidos') para solo devolver los campos que quiero.
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!products) {
                res.status(404).send({ message: 'No hay productos' });
            } else {
                res.status(200).send({ products });
            }
        }
    });
}


// obtener un solo produto
function getProduct(req, res) {

    var productId = req.params.id; // ojo aqui es params

    Product.findById(productId).populate({ path: 'user' }).exec((err, product) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!product) {
                res.status(404).send({ message: 'No existe el producto' });
            } else {
                res.status(200).send({ product });
            }
        }
    });
}

function updateProduct(req, res) {

    var productId = req.params.id;
    var update = req.body;
    // Product hace referencia a la coleccion
    Product.findByIdAndUpdate(productId, update, { new: true }, (err, productUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!productUpdated) {
                res.status(404).send({ message: 'No se ha actualizado el producto' });
            } else {
                res.status(200).send({ producto: productUpdated });
            }
        }
    });
}

function deleteProduct(req, res) {

    var productId = req.params.id; // esto es para recoger el id que tengo dentro de los parametros de la url

    Product.findByIdAndRemove(productId, (err, productRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!productRemoved) {
                res.status(404).send({ message: 'No se ha borrado el producto' });
            } else {
                res.status(200).send({ producto: productRemoved });
            }
        }
    });
}

module.exports = {
    pruebas,
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};