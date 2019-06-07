'use strict'

const express = require('express');
const UserController = require('../controllers/user');

const api = express.Router();

const md_auth = require('../middlewares/authenticated');
const md_admin = require('../middlewares/isAdmin');

api.post('/users', [md_auth.ensureAuth, md_admin.isAdmin], UserController.createUser);
api.put('/users/:id', [md_auth.ensureAuth, md_admin.isAdmin], UserController.updateUser);
api.get('/asesores', [md_auth.ensureAuth, md_admin.isAdmin], UserController.getAsesores);
api.get('/cargas', [md_auth.ensureAuth, md_admin.isAdmin], UserController.getCargas);
api.get('/users', [md_auth.ensureAuth, md_admin.isAdmin], UserController.getUsers);
api.delete('/users/:id', [md_auth.ensureAuth, md_admin.isAdmin], UserController.deleteUser);


module.exports = api;