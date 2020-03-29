var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../../models/user.js')

var configKeys = require('./keys.js').facebookAuth;

module.exports = function(passport){
    
    passport.use(new FacebookStrategy(configKeys,
        function(request, accessToken, refreshToken, profile, done){
            User.findOne({'facebook.id' : profile.id},function(error,currentUser){
                if(error)
                return done(error);

                if(currentUser){
                    return done(null,currentUser);
                }
                else{
                    var newUser = new User();

                    newUser.facebook.id    = profile.id;
                    newUser.facebook.token = accessToken;
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

                    newUser.save(function(err){
                        if(err)
                        return done(err);

                        return done(null,newUser);
                    });
                }
            });
        }
    ));

}