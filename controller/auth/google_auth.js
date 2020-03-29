var GoogleStrategy = require('passport-google-oauth2');

var User = require('../../models/user.js');

var configKeys = require('./keys.js').googleAuth;

module.exports = function(passport){

    passport.use(new GoogleStrategy({
        clientID        : configKeys.clientID,
        clientSecret    : configKeys.clientSecret,
        callbackURL     : configKeys.callbackURL,
        passReqToCallback : true
    },
    function(request, accessToken, refreshToken,profile,done){
        User.findOne({'google.id' : profile.id}, function(error, currentUser){
            if(error)
            return done(error);


            if(currentUser){
                return done(null,currentUser);
            }
            else{
                var newUser = new User();

                newUser.google.id    = profile.id;
                newUser.google.token = accessToken;
                newUser.google.name  = profile.displayName;
                newUser.google.email = (profile.emails[0].value || '').toLowerCase();

                newUser.save(function(err){
                    if(err)
                    return done(err);

                    return done(null,newUser);
                });
            }

        });
    }));



}