'use strict'

const express = require('express');
const bodyParser = require('body-parser');

// cargar el framework de express directamente. se inicializa el servidor atraves de esta variable
const app = express();

// cargar rutas (variables de configuracion de rutas)
const user_routes = require('./routes/user');
const product_routes = require('./routes/product');
const client_routes = require('./routes/client');
const saldo_routes = require('./routes/saldo');
const recargas_routes = require('./routes/recargas');
const informes_routes = require('./routes/informes');
const login_routes = require('./routes/login');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();

});

// rutas base
// aqui ya esta cargada la configuracion de rutas en express, lista para comenzar
app.use('/api', recargas_routes);
app.use('/api', login_routes);
app.use('/api', user_routes);
app.use('/api', product_routes);
app.use('/api', client_routes);
app.use('/api', saldo_routes);
app.use('/api', informes_routes);


module.exports = app;