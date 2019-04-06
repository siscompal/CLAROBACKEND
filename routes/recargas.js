'use strict'

var express = require('express');
var RecargasController = require('../controllers/recargas');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/recargas', RecargasController.DoRecarga);



module.exports = api;