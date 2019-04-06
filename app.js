'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var joi = require('joi');

// cargar el framework de express directamente. se inicializa el servidor atraves de esta variable
var app = express();

// cargar rutas (variables de configuracion de rutas)
var user_routes = require('./routes/user');
var product_routes = require('./routes/product');
var client_routes = require('./routes/client');
var saldo_routes = require('./routes/saldo');
var recargas_routes = require('./routes/recargas');
// middlewares de body parser
// urlencoded es una manera de decir q la info q recibo de los formularios la voy a poder interpretar 
//a traves de la url, y al opcion extended:false es porque solo quiero procesar datos no imgs u otras cosas
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configurar cabeceras y cors

// rutas base
// aqui ya esta cargada la configuracion de rutas en express, lista para comenzar
app.use('/api/users', user_routes);
app.use('/api/products', product_routes);
app.use('/api/clients', client_routes);
app.use('/api/saldo', saldo_routes);
app.use('/api', recargas_routes);

/*app.get('/probando', (req, res) => {
    res.status(200).send({ message: 'Este es el metodo probando' });
});
*/

module.exports = app;