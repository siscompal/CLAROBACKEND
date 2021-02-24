'use strict'
// MODULOS
//libreria bcrypt(para cifrar contraseñas)
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

//MODELOS
const Client = require('../models/client');


async function createClient(req, res) {
    const parametros = req.body;
    const client = new Client();
    let number = (await Client.countDocuments({})) + 1;

    if (parametros.name && parametros.lastname && parametros.iden && parametros.email &&
        parametros.username && parametros.password && parametros.city && parametros.dir &&
        parametros.cel && parametros.porcentaje>=0 && parametros.role) {
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
        client.efectyId = number;


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
                                    const msg = {
                                                    
                                        to: client.email,
                                        from: 'no-reply@clarorecarga.com.co', // Use the email address or domain you verified above
                                        subject: 'Registro Claro Recarga',
                                        text: 'Bienvenido(a) a Claro Recarga',
                                        html: '<h2>Bienvenido(a) a La Plataforma Claro Recargas</h2><hr><p><strong>Datos de Acceso</strong><br><br>Usuario: <strong>' + client.username + '  ' + '</strong> <br>Contraseña: <strong>'+parametros.password +'</strong></p><p>Contáctanos para obtener más información al  313-6500024 o escriba al correo soporteweb@siscompal.com<br><br>Gracias por preferirnos!!</p><p><hr><h5>Esta dirección de correo electrónico es únicamente para envíos automaticos de información y no está habilitado para recibir respuestas o consultas.</h5></p>',
                                    };
                                    
                                    sgMail
                                        .send(msg)
                                        .then(() => {}, error => {
                                        console.error(error);
                                    
                                        if (error.response) {
                                            console.error(error.response.body)
                                        }
                                        });
                                    res.status(200).send({ clienteGuardado: clientStored });
                                }
                            }
                        });
                    });
                } else {
                    res.status(401).send({ message: 'Cliente existente' });
                }
            }
        });

    } else {
        res.status(404).send({ message: 'Introduce los datos correctamente' });
    }

}

async function register(req, res) {
    var parametros = req.body;
    var client = new Client();
    let number = (await Client.countDocuments({})) + 1;

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
        client.efectyId = number;

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
                                    const msg = {
                                                    
                                        to: client.email,
                                        from: 'no-reply@clarorecarga.com.co', // Use the email address or domain you verified above
                                        subject: 'Registro Claro Recarga',
                                        text: 'Bienvenido(a) a Claro Recarga',
                                        html: '<h2>Bienvenido(a) a La Plataforma Claro Recargas</h2><hr><p><strong>Datos de Acceso</strong><br><br>Usuario: <strong>' + client.username + '  ' + '</strong> <br>Contraseña: <strong>'+parametros.password +'</strong></p><p>Contáctanos para obtener más información al  313-6500024 o esciba al correo soporteweb@siscompal.com<br><br>Gracias por preferirnos!!</p><p><hr><h5>Está dirección de correo electronico es únicamente para envíos automáticos de información y no está habilitado para recibir respuestas o consultas</h5></p>',
                                    };
                                    
                                    sgMail
                                        .send(msg)
                                        .then(() => {}, error => {
                                        console.error(error);
                                    
                                        if (error.response) {
                                            console.error(error.response.body)
                                        }
                                        });
                                    
                                    res.status(200).send({ clienteGuardado: clientStored });
                                }
                            }
                        });
                    });
                } else {
                    res.status(401).send({ message: 'Nombre de usuario no disponible' });
                }
            }
        });

    } else {
        res.status(404).send({ message: 'Introduce los datos correctamente' });
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

    Client.find({ user: cliente, status: true }).exec((err, clientes) => {
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
