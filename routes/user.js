'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

var md_auth = require('../middlewares/authenticated'); // Cargo el middleware
var md_admin = require('../middlewares/isAdmin');

// para utilizar un middleware se lo paso como segundo parametro a la ruta que quiero proteger con autenticacion
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', md_auth.ensureAuth, UserController.createUser);
api.post('/login', UserController.login);

// para actualizar dentro de una api restful se usa el metodo PUT
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.get('/asesores', md_auth.ensureAuth, UserController.getAsesores);
api.get('/cargas', md_auth.ensureAuth, UserController.getCargas);
api.get('/usuarios', [md_auth.ensureAuth, md_admin.isAdmin], UserController.getUsers);
api.put('/delete/:id', md_auth.ensureAuth, UserController.deleteUser);



module.exports = api;