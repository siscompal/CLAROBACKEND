'use strict'
// otra forma de importar el router
/*
const { Router } = require('express');
const variable = Router();
*/

const express = require('express');
const api = express.Router();
const ClientController = require('../controllers/client');


// Middlewares
const md_auth = require('../middlewares/authenticated');
const md_global = require('../middlewares/isGlobal');
const md_cliadmin = require('../middlewares/isCliadmin');

api.post('/register', ClientController.register);
api.post('/clients', [md_auth.ensureAuth, md_global.isGlobal], ClientController.createClient);
api.get('/myInfo', [md_auth.ensureAuth], ClientController.getMyInfo);
api.put('/client/:id', [md_auth.ensureAuth], ClientController.updateClient);
api.get('/client/:id', [md_auth.ensureAuth], ClientController.getClient);
api.get('/clients', [md_auth.ensureAuth, md_global.isGlobal], ClientController.getClients);
api.get('/myclients', [md_auth.ensureAuth, md_cliadmin.isCliadmin], ClientController.getMyClients);
api.delete('/client/:id', [md_auth.ensureAuth, md_cliadmin.isCliadmin], ClientController.deleteClient); // Cambia status 


module.exports = api;