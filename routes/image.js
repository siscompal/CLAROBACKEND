'use strict'

const express = require('express');
const api = express.Router();
const ImageController = require('../controllers/image');
const md_auth = require('../middlewares/authenticated');


api.post('/image', ImageController.uploadImage);
api.delete('/image/:id', ImageController.deleteImage);
api.get('/images', ImageController.getImages);

module.exports = api;