'use strict'

var express = require('express');
var ProductController = require('../controllers/product');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/pruebas-producto', md_auth.ensureAuth, ProductController.pruebas);
api.post('/register', md_auth.ensureAuth, ProductController.createProduct);
api.get('/productos', md_auth.ensureAuth, ProductController.getProducts);
api.get('/producto/:id', md_auth.ensureAuth, ProductController.getProduct);
api.post('/filtrar', md_auth.ensureAuth, ProductController.filtrarProducto);
api.put('/update/:id', md_auth.ensureAuth, ProductController.updateProduct);
api.delete('/delete/:id', md_auth.ensureAuth, ProductController.deleteProduct);


module.exports = api;