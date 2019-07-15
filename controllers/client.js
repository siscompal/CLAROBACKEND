'use strict'
// MODULOS
//libreria bcrypt(para cifrar contraseñas)
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');

//MODELOS
const Client = require('../models/client');


function createClient(req, res) {
    var parametros = req.body;
    var client = new Client();

    if (parametros.name && parametros.lastname && parametros.iden && parametros.email &&
        parametros.username && parametros.password && parametros.city && parametros.dir &&
        parametros.cel && parametros.porcentaje && parametros.role) {
        client.name = parametros.name;
        client.lastname = parametros.lastname;
        client.iden = parametros.iden;
        client.email = parametros.email;
        client.username = parametros.username;
        client.password = parametros.password;
        client.city = parametros.city;
        client.dir = parametros.dir;
        client.cel = parametros.cel;
        client.porcentaje = parametros.porcentaje;
        client.efecty = true;
        client.status = true;
        client.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
        client.fec_upd = moment().format('YYYY MM DD HH:mm:ss');
        client.user = req.user.sub;
        client.role = parametros.role;
        client.saldo_actual = 0;
        client.comision_actual = 0;
        client.incentivo_actual = 0;


        // Buscar clientes repetidos 
        Client.findOne({ username: parametros.username.toLowerCase() }, (err, clienteDB) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar el cliente' });
            } else {
                if (!clienteDB) { // si no existe usuario
                    // Cifrar contraseña
                    bcrypt.hash(parametros.password, null, null, function(err, hash) {
                        client.password = hash;

                        //Guardo usuario en db
                        client.save((err, clientStored) => {
                            if (err) {
                                res.status(500).send({ message: 'Error al guardar cliente' });
                                console.log(String(err));
                                console.log(parametros.iden, parametros.name, parametros.username);

                            } else {
                                if (!clientStored) {
                                    res.status(404).send({ message: 'No se ha registrado el cliente' });
                                } else {
                                    res.status(200).send({ clienteGuardado: clientStored });
                                }
                            }
                        });
                    });
                } else {
                    res.status(200).send({ message: 'Cliente existente' });
                }
            }
        });

    } else {
        res.status(200).send({ message: 'Introduce los datos correctamente' });
    }

}

function register(req, res) {
    var parametros = req.body;
    var client = new Client();

    if (parametros.name && parametros.lastname && parametros.iden && parametros.email &&
        parametros.username && parametros.password) {
        client.name = parametros.name;
        client.lastname = parametros.lastname;
        client.iden = parametros.iden;
        client.email = parametros.email;
        client.username = parametros.username;
        client.password = parametros.password;
        client.city = parametros.city;
        client.dir = parametros.dir;
        client.cel = parametros.cel;
        client.porcentaje = 5;
        client.efecty = true;
        client.status = true;
        client.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
        client.fec_upd = moment().format('YYYY MM DD HH:mm:ss');
        client.user = null;
        client.role = "CLI_CLIENTE";
        client.saldo_actual = 0;
        client.comision_actual = 0;
        client.incentivo_actual = 0;

        // Buscar clientes repetidos 
        Client.findOne({ username: parametros.username }, (err, clienteDB) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar el cliente' });
            } else {
                if (!clienteDB) { // si no existe cliente
                    // Cifrar contraseña
                    bcrypt.hash(parametros.password, null, null, function(err, hash) {
                        client.password = hash;

                        //Guardo cliente en db
                        client.save((err, clientStored) => {
                            if (err) {
                                res.status(500).send({ message: 'Error al guardar cliente' });
                                console.log(String(err));
                                console.log(parametros.iden, parametros.name, parametros.username);

                            } else {
                                if (!clientStored) {
                                    res.status(404).send({ message: 'No se ha registrado el cliente' });
                                } else {
                                    res.status(200).send({ clienteGuardado: clientStored });
                                }
                            }
                        });
                    });
                } else {
                    res.status(200).send({ message: 'Cliente existente' });
                }
            }
        });

    } else {
        res.status(200).send({ message: 'Introduce los datos correctamente' });
    }

}


function updateClient(req, res) {
    var clientId = req.params.id;
    var update = req.body;

    Client.findByIdAndUpdate(clientId, update, { new: true }, (err, clientUpdated) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al actualizar cliente',
            });
        } else {
            if (!clientUpdated) {
                return res.status(404).send({
                    message: 'No se ha podido actualizar el cliente',
                });
            } else {
                return res.status(200).send({
                    message: 'Cliente actualizado correctamente',
                    clienteUpdated: clientUpdated
                });

            }
        }
    });

}

// Obtener todos los clientes del sistema 
function getClients(req, res) {
    Client.find({ status: true }).populate('client', 'name lastname').exec((err, clientes) => {
        // .populate('el_usuario', 'nombre apellidos') para solo devolver los campos que quiero.
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!clientes) {
                res.status(404).send({ message: 'No hay clientes' });
            } else {
                res.status(200).send({ clientes });
            }
        }
    });

}


function getClient(req, res) {
    var clientId = req.params.id;

    Client.findById(clientId).exec((err, cliente) => {
        // .populate('el_usuario', 'nombre apellidos') para solo devolver los campos que quiero.
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!cliente) {
                res.status(404).send({ message: 'No hay clientes' });
            } else {
                res.status(200).send({ cliente });
            }
        }
    });

}

function getMyInfo(req, res) {
    var clientId = req.user.sub;

    Client.findById(clientId).exec((err, cliente) => {
        // .populate('el_usuario', 'nombre apellidos') para solo devolver los campos que quiero.
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!cliente) {
                res.status(404).send({ message: 'No hay clientes' });
            } else {
                res.status(200).send({ cliente });
            }
        }
    });

}

// clientes que quieran ver su arbol de clientes
function getMyClients(req, res) {

    var cliente = req.user.sub;

    Client.find({ user: cliente }).exec((err, clientes) => {
        // .populate('usuario', 'nombre apellidos') para solo devolver los campos que quiero.
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!clientes) {
                res.status(404).send({ message: 'No hay clientes' });
            } else {
                res.status(200).send({ clientes });
            }
        }
    });

}

function deleteClient(req, res) {

    var clientId = req.params.id;
    Client.findByIdAndUpdate(clientId, { status: false }, { new: true }, (err, clientInactive) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al eliminar cliente',
            });
        } else {
            if (!clientInactive) {
                return res.status(404).send({
                    message: 'No se ha podido eliminar el cliente',
                });
            } else {
                return res.status(200).send({
                    message: 'Cliente eliminado correctamente',
                    clientInactive: clientInactive
                });

            }
        }
    });
}

function updatePassword(req, res) {
    var clientId = req.params.id;
    var update = req.body;

    bcrypt.hash(update, null, null, function(err, hash) {
        update = hash;
    });

    Client.findByIdAndUpdate(clientId, update, { new: true }, (err, clientUpdated) => {
        if (err) {
            return res.status(500).send({
                message: 'Internal server error',
            });
        } else {
            if (!clientUpdated) {
                return res.status(404).send({
                    message: 'No se ha podido actualizar el cliente',
                });
            } else {

                return res.status(200).send({
                    message: 'Cliente actualizado correctamente',
                    clienteUpdated: clientUpdated
                });

            }
        }
    });

}

module.exports = {
    register,
    createClient,
    updateClient,
    getClients,
    getClient,
    getMyClients,
    deleteClient,
    getMyInfo
}