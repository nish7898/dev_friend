
var User = require('../../models/user.js');

module.exports = function(passport){

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    require('./google_auth.js')(passport);
    require('./facebook_auth.js')(passport);

}