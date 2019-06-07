'use strict'

const express = require('express');
const api = express.Router();
const ClientController = require('../controllers/client');


// Middlewares
const md_auth = require('../middlewares/authenticated');
const md_admin = require('../middlewares/isAdmin');
const md_mayo = require('../middlewares/isMayorista');
const md_distri = require('../middlewares/isDistribuidor');
const md_global = require('../middlewares/isGlobal');


api.post('/clients', [md_auth.ensureAuth, md_admin.isAdmin, md_global.isGlobal], ClientController.createClient);
api.put('/clients/:id', [md_auth.ensureAuth, md_admin.isAdmin, md_global.isGlobal], ClientController.updateClient);
api.get('/clients/', [md_auth.ensureAuth, md_admin.isAdmin, md_global.isGlobal], ClientController.getClients);
api.delete('/clients/:id', [md_auth.ensureAuth, md_admin.isAdmin, md_mayo.isMayorista, md_distri.isDistribuidor], ClientController.deleteClient); // Cambia status 


module.exports = api;