var passport = require('passport'),
	TwitterStrategy = require('passport-twitter').Strategy;

var twitterConnection = function(server) {
	passport.use(new TwitterStrategy({
		consumerKey: '8eo8ph2L1i6dfBQmB0lXT74Oe',
		consumerSecret: 'vE0HvHWx2JzOUEaTet0UX2TLh6penN1JtyJSWLQEuoEfqC11oS',
		callbackURL: 'http://localhost:8000/auth/twitter/callback'

	}, function (accessToken, RefreshToken, profile, done){
		done(null, profile);
	}))	;

	server.get('/auth/twitter', passport.authenticate('twitter'));

	server.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect: '/extra-data',
		failureRedirect: '/error'}));

};

module.exports = twitterConnection;