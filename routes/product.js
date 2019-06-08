'use strict'

const express = require('express');
const ProductController = require('../controllers/product');

const api = express.Router();
const md_auth = require('../middlewares/authenticated');
const md_admin = require('../middlewares/isAdmin');


api.post('/products', [md_auth.ensureAuth, md_admin.isAdmin], ProductController.createProduct);
api.get('/products', [md_auth.ensureAuth, md_admin.isAdmin], ProductController.getProducts);
api.get('/product/:id', [md_auth.ensureAuth, md_admin.isAdmin], ProductController.getProduct);
api.post('/filtrar', md_auth.ensureAuth, ProductController.filtrarProducto);
api.put('/products/:id', [md_auth.ensureAuth, md_admin.isAdmin], ProductController.updateProduct);
api.delete('/products/:id', [md_auth.ensureAuth, md_admin.isAdmin], ProductController.deleteProduct);


module.exports = api;