'use strict'

const express = require('express');
const ProductController = require('../controllers/product');

const api = express.Router();
const md_auth = require('../middlewares/authenticated');
const md_admin = require('../middlewares/isAdmin');
const md_cliente = require('../middlewares/isCliente');

api.post('/products', [md_auth.ensureAuth, md_admin.isAdmin], ProductController.createProduct);
api.get('/products', [md_auth.ensureAuth, md_admin.isAdmin], ProductController.getProducts);
api.get('/products/:id', [md_auth.ensureAuth, md_admin.isAdmin], ProductController.getProduct);
api.post('/filtrar', [md_auth.ensureAuth, md_cliente.isCliente], ProductController.filtrarProducto);
api.put('/products/:id', [md_auth.ensureAuth, md_admin.isAdmin], ProductController.updateProduct);
api.delete('/products/:id', [md_auth.ensureAuth, md_admin.isAdmin], ProductController.deleteProduct);


module.exports = api;