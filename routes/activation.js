'use strict'

const express = require('express');
const ActivationController = require('../controllers/activation');

const api = express.Router();
const md_auth = require('../middlewares/authenticated');
const md_admin = require('../middlewares/isAdmin');


api.post('/sims', [md_auth.ensureAuth], ActivationController.createSim);
api.get('/sims', [md_auth.ensureAuth], ActivationController.getSims);
api.put('/sim/:id', [md_auth.ensureAuth], ActivationController.updateSim);
api.post('/activar', [md_auth.ensureAuth], ActivationController.activateSim);

module.exports = api;
