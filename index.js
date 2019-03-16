// Aqui tenemos la conexion al servidor, y la conexion a l abase de datos.
'use strict'

// cargamos el modulo de mongoose en una variable, que nos va a servir para trabajar con la db dentro de nuestra APIrest

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3789;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/claro')
    .then(() => {
        console.log('Conexion exitosa a la base de datos');

        // crear el servidor y lanzarlo
        app.listen(port, () => {
            console.log('El servidor local con node y express esta corriendo');
        });
    })
    .catch(err => console.log(err));