var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy;

var facebookConnection = function(server) {
	passport.use(new FacebookStrategy({
		clientID: '855342294520057',
		clientSecret: '44211e696a69cb5339790ccd68c60c25',
		callbackURL: 'http://localhost:8000/auth/facebook/callback'

	}, function (accessToken, RefreshToken, profile, done){
		done(null, profile);
	}))	;

	server.get('/auth/facebook', passport.authenticate('facebook'));

	server.get('/auth/facebook/callback', passport.authenticate('facebook', {successRedirect: '/extra-data',
		failureRedirect: '/error'}));

};

module.exports = facebookConnection;