'use strict'
/*
const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

const port = process.env.PORT;
//Url for conection with MongoDB Atlas


const url = 'mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@cluster0-nrqhe.mongodb.net/test?retryWrites=true&w=majority'
const options = {
    useNewUrlParser: true,
    dbName: "claro"
};

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect(url, options).then(
    () => {
        console.log("Connection to the database successfully established");
        app.listen(port, () => {
            console.log("Server running correctly in the url: localhost:" + port);

        });
    },
    err => {
        console.log("Error connecting Database instance due to: ", err);
    }
);
*/

var app = require('./app');
// Cargamos el modulo de mongoose en una variable, que nos va a servir para trabajar con la db dentro de nuestra APIrest
var mongoose = require('mongoose');

var port = process.env.PORT || 3700;

mongoose.Promise = global.Promise;
//conexion a la db
mongoose.connect('mongodb://localhost:27017/claro', { useNewUrlParser: true })
    .then(() => {

        console.log('Conexion exitosa a la base de datos');

        // crear el servidor web y lanzarlo
        app.listen(port, () => {
            console.log('El servidor local con node y express esta corriendo en el puerto ' + port);
        });
    })
    .catch(err => console.log(err));