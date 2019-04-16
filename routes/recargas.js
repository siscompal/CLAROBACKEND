'use strict'

var express = require('express');
var RecargasController = require('../controllers/recargas');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/recargas', md_auth.ensureAuth, RecargasController.DoRecarga);
api.get('/balance', md_auth.ensureAuth, RecargasController.getSaldo);


module.exports = api;