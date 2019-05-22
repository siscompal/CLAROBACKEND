'use strict'

var express = require('express');
var RecargasController = require('../controllers/recargas');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_cliente = require('../middlewares/isCliente');
api.post('/recargas', [md_auth.ensureAuth, md_cliente.isCliente], RecargasController.DoRecarga);
api.get('/balance', md_auth.ensureAuth, RecargasController.getSaldo);


module.exports = api;