'use strict'

const express = require('express');
const RecargasController = require('../controllers/recargas');

const api = express.Router();
const md_auth = require('../middlewares/authenticated');
const md_cliente = require('../middlewares/isCliente');
const md_global = require('../middlewares/isGlobal');


api.post('/recargas', [md_auth.ensureAuth, md_cliente.isCliente], RecargasController.DoRecarga);
api.get('/misRecargas', [md_auth.ensureAuth, md_cliente.isCliente], RecargasController.misRecargas);
api.get('/allRecargas', [md_auth.ensureAuth, md_global.isGlobal], RecargasController.allRecargas);


module.exports = api;