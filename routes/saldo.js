'use strict'

var express = require('express');
var SaldoController = require('../controllers/saldo');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// api.get('/pruebas-saldo', md_auth.ensureAuth, SaldoController.pruebas);
api.put('/asignar/:id', md_auth.ensureAuth, SaldoController.asignar_saldo);
api.put('/debitar/:id', md_auth.ensureAuth, SaldoController.debitar_saldo);
api.post('/pasarSaldo', md_auth.ensureAuth, SaldoController.pasarSaldo);


module.exports = api;