module.exports = function(router,passport){
    router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));

    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
    }));

    router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    router.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
    }));
}