'use strict'

const express = require('express');
const api = express.Router();
const InformeController = require('../controllers/informe');



const md_auth = require('../middlewares/authenticated');
const md_global = require('../middlewares/isGlobal');
const md_admin = require('../middlewares/isAdmin');
const md_cliente = require('../middlewares/isCliente');

api.get('/listarRecargas', [md_auth.ensureAuth, md_cliente.isCliente], InformeController.listarRecargas);
api.get('/allRecargas', [md_auth.ensureAuth, md_admin.isAdmin, md_global.isGlobal], InformeController.allRecargas);


module.exports = api;
// falta el endpoint de de los repartos y asignaciones de saldo