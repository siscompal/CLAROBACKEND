'use strict'

var express = require('express');
var api = express.Router();
var LoginController = require('../controllers/login');


api.post('/login', LoginController.login);

module.exports = api;