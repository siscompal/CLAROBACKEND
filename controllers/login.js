'use strict'
// MODULOS

const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');

//MODELOS
const User = require('../models/user');
const Client = require('../models/client');

// servicios jwt 
const jwt = require('../services/jwt');

function login(req, res) {
    // recibimos los parametros que me llegan en la peticion 
    var parametros = req.body;

    // variable que guarda el campo que necesito para verificar
    var username = parametros.username;
    var pass = parametros.password;
    //var role = parametros.role;
    // 1. comprobar que el usuario existe, buscando por la variable username

    User.findOne({ username: username, status: true }, (err, existe) => {
        if (err) {
            res.status(500).send({ message: 'Error al verificar el usuario' });
        } else {
            if (existe) { // si existe el usuario lo devuelvo, existe es el usuario a loguear
                // verifico que la contraseña es correcta
                bcrypt.compare(pass, existe.password, (err, check) => {
                    if (check) {
                        if (parametros.gettoken) {
                            // devolver el token jwt
                            res.status(200).send({
                                token: jwt.createToken(existe),
                                // existe = existe.map(u => ({ _id: u._id, name: u.name, lastname: u.lastname, username: u.username, role: u.role })),
                                usuarioLoqueado: existe
                            });
                        } else {
                            res.status(200).send({ existe });
                        }

                    } else {
                        res.status(404).send({ message: 'Usuario y/o contraseña incorrectos' });
                    }
                });
            } else {
                // busco si es cliente 
                Client.findOne({ username: username, status: true }, (err, existe) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al verificar el usuario' });
                    } else {
                        if (existe) { // si existe el usuario lo devuelvo
                            // verifico que la contraseña es correcta
                            bcrypt.compare(pass, existe.password, (err, check) => {
                                if (check) {
                                    if (parametros.gettoken) {
                                        // devolver el token jwt
                                        res.status(200).send({
                                            token: jwt.createToken(existe),
                                            usuarioLoqueado: existe
                                        });
                                    } else {
                                        res.status(200).send({ usuarioLoqueado: existe });
                                    }

                                } else {
                                    res.status(404).send({ message: 'Usuario y/o contraseña incorrectos' });
                                }
                            });
                        } else {
                            console.log(existe);
                            res.status(404).send({ message: 'El usuario no existe' });
                        }
                    }
                });

            } // else de buscar cliente
        }
    });
}

function updatePassword(req, res) {

    var usucliId = req.params.id;
    var parametros = req.body;
    var pass = parametros.password;
   

    User.findById(usucliId, (err, userId) => {
        if (err) {
            return res.status(500).send({ message: "Prueba de error" });
        } else {
            if (userId) {
                bcrypt.hash(pass, null, null, function(err, hash) {
                    userId.password = hash;
                    let newpass = userId.password;

                    console.log(userId.password);
                    User.findByIdAndUpdate(userId, { password: newpass }, { new: true }, (err, update) => {
                        if (err) {
                            return res.status(500).send({
                                message: 'Internal server error 1',
                            });
                        } else {
                            if (!update) {
                                return res.status(404).send({
                                    message: 'Error al cambiar contraseña',
                                });
                            } else {
                                return res.status(200).send({
                                    message: 'Contraseña cambiada exitosamente',
                                    user: update
                                });
                            }
                        }

                    });
                });

            } else {
		console.log("Es un cliente");
                Client.findById(usucliId, (err, clientId) => {
                    if (err) {
                        return res.status(500).send({ message: "Internal server error 2" });
                    } else {
                        if (clientId) {
                            bcrypt.hash(pass, null, null, function(err, hash) {
                                clientId.password = hash;
                                let newpass = clientId.password;


                                Client.findByIdAndUpdate(clientId, { password: newpass }, { new: true }, (err, update) => {
                                    if (err) {
                                        return res.status(500).send({
                                            message: 'Internal server error 3',
                                        });
                                    } else {
                                        if (!update) {
                                            return res.status(404).send({
                                                message: 'Error al cambiar contraseña',
                                            });
                                        } else {
                                            return res.status(200).send({
                                                message: 'Contraseña cambiada exitosamente',
                                                user: update
                                            });
                                        }
                                    }

                                });
                            });

                        } else {

                            return res.status(404).send({ message: "Usuario no encontrado" });
                        }
                    }

                });
            }
        }

    });

}

module.exports = {
    login,
    updatePassword
}
