'use strict'

const express = require('express');
const SaldoController = require('../controllers/saldo');

const api = express.Router();

// Middlewares
const md_auth = require('../middlewares/authenticated');
const md_admin = require('../middlewares/isAdmin');
const md_cargas = require('../middlewares/isCargas');
const md_cliente = require('../middlewares/isCliente')


api.put('/asignar/:id', [md_auth.ensureAuth, md_admin.isAdmin, md_cargas.isCargas], SaldoController.asignar_saldo);
api.put('/debitar/:id', [md_auth.ensureAuth, md_admin.isAdmin, md_cargas.isCargas], SaldoController.debitar_saldo);
api.post('/pasarSaldo', [md_auth.ensureAuth, md_cliente.isCliente], SaldoController.pasarSaldo);


module.exports = api;