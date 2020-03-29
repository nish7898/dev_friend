var express = require('express');
var app = express();

var passport = require('passport');

var port = process.env.PORT || 3000;

var ejs = require('ejs');
app.set('view engine','ejs');

var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDataBase = "mongodb://127.0.0.1:27017/devfriend";
var mongoose = require('mongoose');
mongoose.connect(configDataBase);

app.use(cookieParser());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'ilovescotchscotchyscotchscotch', 
    resave: false,
    saveUninitialized: true,
    maxAge : 24*60*60*1000
}));
app.use(passport.initialize());
app.use(passport.session()); 


require('./controller/auth/auth.js')(passport);
require('./controller/routes.js')(app,passport);

app.listen(port,function(){
    console.log("Server up and running at port : ",port);
});