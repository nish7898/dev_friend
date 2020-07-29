module.exports = function(router,passport){

    //Home Page route
    router.get('/',function(request,response){
        response.render('index');
    });

    require('./routes/login.js')(router,passport);
    require('./routes/newProject.js')(router);
    require('./routes/profile')(router);
    require('./routes/updateProject.js')(router);
    require('./routes/search.js')(router);
    require('./routes/requestProject.js')(router);

    router.get('/profile',isLoggedIn,function(request,response){
        response.render('profile',{
            user : request.user
        });
    })
}

function isLoggedIn(request, response, next) {
    if (request.isAuthenticated())
        return next();

    response.redirect('/');
}