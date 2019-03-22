'use strict'
// MODULOS
//libreria bcrypt(para cifrar contraseñas)
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');

//MODELOS
var User = require('../models/user');

// servicios jwt 
var jwt = require('../services/jwt');
//ACCIONES O METODOS
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de usuarios y la accion pruebas',
        user: req.user
    });

}
// Registro de usuarios
function createUser(req, res) {
    // recoger los parametros(body)q llegan por la peticion (q ya ha sido convertido en un objeto json)
    // almacenamos los parametros en una variable
    var parametros = req.body;

    //Crear objeto usuario
    var user = new User();



    //Asignar valores al objeto usuario

    if (parametros.iden && parametros.lastname && parametros.name && parametros.username && parametros.password && parametros.email && parametros.cel && parametros.status && parametros.role) {
        user.name = parametros.name;
        user.lastname = parametros.lastname;
        user.iden = parametros.iden;
        user.username = parametros.username;
        user.password = parametros.password;
        user.email = parametros.email;
        user.cel = parametros.cel;
        user.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
        user.fec_upd = moment().format('YYYY MM DD HH:mm:ss');
        user.status = parametros.status;
        user.role = parametros.role;

        // comprobar usuarios duplicados
        User.findOne({ username: parametros.username.toLowerCase() }, (err, issetUser) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar el usuario' });
            } else {
                if (!issetUser) { // si no existe usuario
                    // Cifrar contraseña
                    bcrypt.hash(parametros.password, null, null, function(err, hash) {
                        user.password = hash;

                        //Guardo usuario en db
                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({ message: 'Error al guardar usuario' });
                                console.log(String(err));
                                console.log(parametros.iden, parametros.name, parametros.lastname);

                            } else {
                                if (!userStored) {
                                    res.status(404).send({ message: 'No se ha registrado el usuario' });
                                } else {
                                    res.status(200).send({ user: userStored });
                                }
                            }
                        });
                    });
                } else {
                    res.status(200).send({ message: 'Usuario existente' });
                }
            }
        });
    } else {
        res.status(200).send({ message: 'Introduce los datos correctamente' });
    }
}

function login(req, res) {

    // recibimos los parametros que me llegan en la peticion 
    var parametros = req.body;

    // variable que guarde el campo que necesito para verificar
    var username = parametros.username;
    var pass = parametros.password;
    var role = parametros.role;

    // 1. comprobar que el usuario existe, buscando por la variable username
    // el parametro  existe puede ser cualquier nombre
    User.findOne({ username: username.toLowerCase() }, (err, existe) => {
        if (err) {
            res.status(500).send({ message: 'Error al verificar el usuario' });
        } else {
            if (existe) { // si existe el usuario lo devuelvo
                // verifico que la contraseña es correcta
                bcrypt.compare(pass, existe.password, (err, check) => {
                    if (check) {
                        //
                        if (parametros.gettoken) {
                            // devolver el token jwt
                            res.status(200).send({
                                token: jwt.createToken(existe)
                            });
                        } else {
                            res.status(200).send({ existe });
                        }

                    } else {
                        res.status(404).send({ message: 'Usuario y/o contraseña incorrectos' });
                    }
                });
            } else {
                res.status(404).send({ message: 'El usuario no  existe' });
            }
        }
    });
}

function updateUser(req, res) {

    var userId = req.params.id;
    //recogemos los datos q vamos a tener en el body para actualizar el usuario (los datos que seran modificados)
    var update = req.body;

    // comprobamos si el id del usuario logueado es diferente al id que llega por la URL
    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permitido actualizar usuario' });
    }
    // si ambos userId son iguales
    // findByAnyUpdate va a recibir el id del documento a actualizar, y un objeto con los datos a actualizar que puede llevar un solo campo o todos los campos.
    // new:true me devuelve el objeto que ha sido actualizado
    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al actualizar usuario',
            });
        } else {
            if (!userUpdated) {
                return res.status(404).send({
                    message: 'No se ha podido actualizar usuario',
                });
            } else {
                return res.status(200).send({
                    message: 'Usuario actualizado correctamente',
                    user: userUpdated
                });
                // return res.status(200).send({ user: userUpdated });

            }
        }
    });


}

// listar usuarios tipo asesor
function getAsesores(req, res) {

    User.find({ role: 'ROLE_ASESOR' }).exec((err, users) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!users) {
                res.status(404).send({ message: 'No hay asesores' });
            } else {
                res.status(200).send({ users });
            }
        }
    });
}
// listar usuarios tipo cliente
function getClientes(req, res) {
    User.find({ role: 'ROLE_CLIENTE' }).exec((err, users) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!users) {
                res.status(404).send({ message: 'No hay clientes registrados' });
            } else {
                res.status(200).send({ users });
            }
        }
    });
}



// listar usuarios tipo cargas
function getCargas(req, res) {
    User.find({ role: 'ROLE_CARGAS' }).exec((err, users) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!users) {
                res.status(404).send({ message: 'No hay puntos de venta' });
            } else {
                res.status(200).send({ users });
            }
        }
    });
}


function deleteUser() {

}

module.exports = {
    pruebas,
    createUser,
    login,
    updateUser,
    getAsesores,
    getClientes,
    getCargas
};