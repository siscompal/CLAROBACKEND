'use strict'
// MODULOS

var moment = require('moment');

//MODELOS
var User = require('../models/user');
var Product = require('../models/product');

function createProduct(req, res) {
    var product = new Product();

    var parametros = req.body;

    if (parametros.name && parametros.precio >=0  && parametros.codigo && parametros.descripcion &&
        parametros.tipo && parametros.incentivo >= 0) {
        // setteo las variables
        product.name = parametros.name;
        product.precio = parametros.precio;
        product.codigo = parametros.codigo;
        product.status = true
        product.tipo = parametros.tipo;
        product.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
        product.fec_upd = moment().format('YYYY MM DD HH:mm:ss');
        product.user = req.user.sub; //  req.user.sub para guardar el id del usuario logueado
        product.incentivo = parametros.incentivo;
        product.descripcion = parametros.descripcion;
        Product.findOne({ codigo: parametros.codigo }, (err, productoDB) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar producto' });
            } else {
                if (!productoDB) {
                    console.log(product);
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
                    res.status(500).send({ message: 'Producto existente' });
                }

            }
        });

    } else {
        res.status(404).send({ message: 'Todos los campos son obligatorios' });
    }

}

// listar todos los productos (admin)

function getProducts(req, res) {
    Product.find({}).populate('user', 'name lastname').exec((err, products) => {
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


// obtener un solo produto (admin)
function getProduct(req, res) {
    var productId = req.params.id; // ojo aqui es params

    Product.findById(productId).exec((err, product) => {
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

function filtrarProducto(req, res) {

    var tipo = req.params.tipo;
    console.log(tipo);

    if (tipo == "todoIncluido") {

        Product.find({ tipo: tipo }, (err, todoIncluido) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar el producto' });
            } else {
                if (!todoIncluido) {
                    res.status(404).send({ message: 'Producto no encontrado' });
                } else {
                    res.status(200).send({ data: todoIncluido });
                }
            }
        });


    } else if (tipo == "voz") {
        Product.find({ tipo: tipo }, (err, voz) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar el producto' });
            } else {
                if (!voz) {
                    res.status(404).send({ message: 'Producto no encontrado' });
                } else {
                    res.status(200).send({ data: voz });
                }
            }
        });

    } else if (tipo == "largaDistancia") {
        Product.find({ tipo: tipo }, (err, largaDistancia) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar el producto' });
            } else {
                if (!largaDistancia) {
                    res.status(404).send({ message: 'Producto no encontrado' });
                } else {
                    res.status(200).send({ data: largaDistancia });
                }
            }
        });

    } else if (tipo == "navegacion") {
        Product.find({ tipo: tipo }, (err, navegacion) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar el producto' });
            } else {
                if (!navegacion) {
                    res.status(404).send({ message: 'Producto no encontrado' });
                } else {
                    res.status(200).send({ data: navegacion });
                }
            }
        });

    } else if (tipo == "chat") {
        Product.find({ tipo: tipo }, (err, chat) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar el producto' });
            } else {
                if (!chat) {
                    res.status(404).send({ message: 'Producto no encontrado' });
                } else {
                    res.status(200).send({ data: chat });
                }
            }
        });

    } else if (tipo == "tv") {
        Product.find({ tipo: tipo }, (err, tv) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar el producto' });
            } else {
                if (!tv) {
                    res.status(404).send({ message: 'Producto no encontrado' });
                } else {
                    res.status(200).send({ data: tv });
                }
            }
        });

    } else if (tipo == "apps") {
        Product.find({ tipo: tipo }, (err, Apps) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar el producto' });
            } else {
                if (!Apps) {
                    res.status(404).send({ message: 'Producto no encontrado' });
                } else {
                    res.status(200).send({ data: Apps });
                }
            }
        });

    } else if (tipo == "internetInalambrico") {
        Product.find({ tipo: tipo }, (err, internetInalambrico) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar el producto' });
            } else {
                if (!internetInalambrico) {
                    res.status(404).send({ message: 'Producto no encontrado' });
                } else {
                    res.status(200).send({ data: internetInalambrico });
                }
            }
        });

    } else if (tipo == "minuteras") {
        Product.find({ tipo: tipo }, (err, minuteras) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar el producto' });
            } else {
                if (!minuteras) {
                    res.status(404).send({ message: 'Producto no encontrado' });
                } else {
                    res.status(200).send({ data: minuteras });
                }
            }
        });

    } else {
        res.status(404).send({ message: 'Tipo de producto no existe' });
    }


} // fin filtrarProducto

function updateProduct(req, res) {

    var productId = req.params.id; // lo q viene por url
    var update = req.body;

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
                res.status(200).send({ message: 'Producto eliminado exitosamente' });
            }
        }
    });
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    filtrarProducto
};
