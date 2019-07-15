'use strict'

const express = require('express');
const api = express.Router();
const ImageController = require('../controllers/image');
const md_auth = require('../middlewares/authenticated');


api.post('/upload', ImageController.uploadImage);

module.exports = api;