'use strict'

var express = require('express');
var InformeController = require('../controllers/informe');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// para utilizar un middleware se lo paso como segundo parametro a la ruta que quiero proteger con autenticacion
api.get('/listarRecargas', md_auth.ensureAuth, InformeController.listarRecargas);
api.get('/allRecargas', md_auth.ensureAuth, InformeController.allRecargas);
//api.post('/register', md_auth.ensureAuth, ClientController.createClient);



module.exports = api;