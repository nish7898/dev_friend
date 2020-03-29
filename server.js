var express = require('express');
var app = express();

var passport = require('passport');

var port = process.env.PORT || 3000;

var ejs = require('ejs');
app.set('view engine','ejs');

var mongoose = require('mongoose');
require('./controller/database.js')(mongoose);

require('./controller/requirements.js')(app,passport);

require('./controller/auth/auth.js')(passport);
require('./controller/routes.js')(app,passport);

app.listen(port,function(){
    console.log("Server up and running at port : ",port);
});