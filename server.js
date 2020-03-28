var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

var ejs = require('ejs');
app.set('view engine','ejs');



require('./controller/routes.js')(app);

app.listen(port,function(){
    console.log("Server up and running at port : ",port);
});