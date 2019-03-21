'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated'); // Cargo el middleware

// para utilizar un middleware se lo paso como segundo parametro a la ruta que quiero proteger con autenticacion
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);

api.post('/register', md_auth.ensureAuth, UserController.createUser);
api.post('/login', UserController.login);
// para actualizar dentro de una api restful se usa el metodo PUT
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.get('/asesores', md_auth.ensureAuth, UserController.getAsesores);
api.get('/clientes', md_auth.ensureAuth, UserController.getClientes);
api.get('/cargas', md_auth.ensureAuth, UserController.getCargas);



module.exports = api;