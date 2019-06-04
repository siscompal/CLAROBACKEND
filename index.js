'use strict'

const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

const port = process.env.PORT;
//Url for conection with MongoDB Atlas


const url = 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@cluster0-nrqhe.mongodb.net/test?retryWrites=true&w=majority'
const options = {
    useNewUrlParser: true,
    dbName: "claro"
  };

mongoose.Promise = global.Promise;
mongoose.connect(url, options).then(
    () => {
        console.log("Connection to the database successfully established");
        app.listen(port, ()=> {
            console.log("Server running correctly in the url: localhost:"+port);
        });
      },
      err => {
        console.log("Error connecting Database instance due to: ", err);
      }
     );