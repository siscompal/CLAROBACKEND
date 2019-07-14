'use strict'

const express = require('express');
const api = express.Router();
const LoginController = require('../controllers/login');
const md_auth = require('../middlewares/authenticated');

api.post('/login', LoginController.login);
api.put('/cambiarpass/:id', [md_auth.ensureAuth], LoginController.updatePassword);

module.exports = api;