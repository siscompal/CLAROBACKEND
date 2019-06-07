'use strict'

const express = require('express');
const api = express.Router();
const LoginController = require('../controllers/login');


api.post('/login', LoginController.login);

module.exports = api;