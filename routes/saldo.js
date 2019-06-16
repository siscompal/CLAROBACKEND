'use strict'

const express = require('express');
const SaldoController = require('../controllers/saldo');

const api = express.Router();

// Middlewares
const md_auth = require('../middlewares/authenticated');
const md_admin = require('../middlewares/isAdmin');
const md_cargas = require('../middlewares/isCargas');
const md_global = require('../middlewares/isGlobal');

api.put('/asignar/:id', [md_auth.ensureAuth, md_cargas.isCargas], SaldoController.asignar_saldo);
api.put('/debitar/:id', [md_auth.ensureAuth, md_cargas.isCargas], SaldoController.debitar_saldo);
api.post('/pasarSaldo', [md_auth.ensureAuth], SaldoController.pasarSaldo);
api.get('/balance', [md_auth.ensureAuth, md_admin.isAdmin], SaldoController.getSaldo);
api.get('/misRepartos', [md_auth.ensureAuth, md_global.isGlobal], SaldoController.misRepartos);
api.get('/allRepartos', [md_auth.ensureAuth, md_global.isGlobal], SaldoController.allRepartos);
// api.put('/prueba/:id', [md_auth.ensureAuth, md_cargas.isCargas], SaldoController.pruebaSaldo);


module.exports = api;