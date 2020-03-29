module.exports = function(router,passport){

    //Home Page route
    router.get('/',function(request,response){
        response.render('index');
    });

    require('./routes/login.js')(router,passport);

    router.get('/profile',isLoggedIn,function(request,response){
        response.send("Hello!");
    })
}

function isLoggedIn(request, response, next) {
    if (request.isAuthenticated())
        return next();

    response.redirect('/');
}