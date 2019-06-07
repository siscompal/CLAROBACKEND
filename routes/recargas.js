'use strict'

const express = require('express');
const RecargasController = require('../controllers/recargas');

const api = express.Router();
const md_auth = require('../middlewares/authenticated');
const md_cliente = require('../middlewares/isCliente');
const md_mayo = require('../middlewares/isMayorista');
const md_distri = require('../middlewares/isDistribuidor');

api.post('/recargas', [md_auth.ensureAuth, md_cliente.isCliente], RecargasController.DoRecarga);
api.get('/balance', [md_auth.ensureAuth, md_cliente.isCliente, md_distri.isDistribuidor, md_mayo.isMayorista], RecargasController.getSaldo);


module.exports = api;