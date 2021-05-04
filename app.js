'use srtict'

//Loads modules to create server.
const express = require('express');
const bodyParser = require('body-parser');

//Executes express.
const app = express();

//Cargar routes files.
var articleRoutes = require('./routes/article');

//Middlewares:
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS config.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Adds prefix to routes.
app.use('/api', articleRoutes);

//Exports module.
module.exports = app;