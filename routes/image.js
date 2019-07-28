'use strict'

const express = require('express');
const api = express.Router();
const ImageController = require('../controllers/image');
const md_auth = require('../middlewares/authenticated');
const multipart = require('connect-multiparty');

var multipartMiddleware = multipart({ uploadDir: './uploads' });

api.post('/image', multipartMiddleware, ImageController.uploadImage);
api.delete('/image/:id', ImageController.deleteImage);
api.get('/images', ImageController.getImages);
api.get('/image/:image', ImageController.getImageFile);

module.exports = api;