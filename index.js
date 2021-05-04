'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = 3900;

/*
NOTES:

- useNewUrlParser: allows to use all new mongoose's functionalities.

- useUnifiedTopology disables warning "Current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor."

Example: mongoose.connect(url, options).
*/

mongoose.set('useFindAndModify', false); //Disables old mongoose methods.
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/api_rest_blog', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {

    console.log('Conectado a la BD.');

    //Creates server and listen to HTTP requests.
    app.listen(port, () => {
        console.log('Server running on http://localhost:' + port);
    });

});