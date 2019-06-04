'use strict'

const express = require('express');
const ClientController = require('../controllers/client');

const api = express.Router();
const md_auth = require('../middlewares/authenticated');

// para utilizar un middleware se lo paso como segundo parametro a la ruta que quiero proteger con autenticacion
api.get('/pruebas-cliente', md_auth.ensureAuth, ClientController.pruebas);
api.post('/register', md_auth.ensureAuth, ClientController.createClient);
api.post('/login', ClientController.login);
api.put('/update/:id', md_auth.ensureAuth, ClientController.updateClient);
api.get('/listado/', md_auth.ensureAuth, ClientController.getClients);
api.put('/delete/:id', md_auth.ensureAuth, ClientController.deleteClient);


module.exports = api;