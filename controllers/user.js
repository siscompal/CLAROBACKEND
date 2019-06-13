'use strict'
// MODULOS
//libreria bcrypt(para cifrar contraseñas)
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');


//MODELOS
var User = require('../models/user');

// servicios jwt 
var jwt = require('../services/jwt');

// Registro de usuarios
function createUser(req, res) {

    var parametros = req.body;
    var user = new User();

    //Asignar valores al objeto usuario

    if (parametros.iden && parametros.lastname && parametros.name && parametros.username && parametros.role) {
        user.name = parametros.name;
        user.lastname = parametros.lastname;
        user.iden = parametros.iden;
        user.username = parametros.username;
        user.password = parametros.password;
        user.email = parametros.email;
        user.cel = parametros.cel;
        user.fec_cre = moment().format('YYYY MM DD HH:mm:ss');
        user.fec_upd = moment().format('YYYY MM DD HH:mm:ss');
        user.status = true;
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


function updateUser(req, res) {

    var userId = req.params.id;
    //recibimos los datos del body
    var update = req.body;


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


// listar all usuarios
function getUsers(req, res) {
    User.find({}).exec((err, users) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!users) {
                res.status(404).send({ message: 'No hay usuarios' });
            } else {
                res.status(200).send({ users });
            }
        }
    });
}


function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId).exec((err, user) => {
        // .populate('el_usuario', 'nombre apellidos') para solo devolver los campos que quiero.
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!user) {
                res.status(404).send({ message: 'No hay usuarios' });
            } else {
                res.status(200).send({ user });
            }
        }
    });

}

function deleteUser(req, res) {
    var userId = req.params.id;

    User.findByIdAndUpdate(userId, { status: false }, { new: true }, (err, userInactive) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al eliminar cliente',
            });
        } else {
            if (!userInactive) {
                return res.status(404).send({
                    message: 'No se ha podido eliminar el cliente',
                });
            } else {
                return res.status(200).send({
                    message: 'Cliente eliminado correctamente',
                    usuarioInactivo: userInactive
                });

            }
        }
    });
}



module.exports = {
    createUser,
    updateUser,
    getUsers,
    getUser,
    deleteUser
};