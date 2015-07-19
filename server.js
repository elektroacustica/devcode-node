var express = require('express');
var swig = require('swig');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var http = require('http');
var server = express();

var server_socket = http.createServer(server).listen(8000);
var io =  require('socket.io').listen(server_socket);

swig.setDefaults({
	cache: false
});


//config de express
server.use(bodyParser.urlencoded({
	extend: true
}));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(session({secret: 'mi clave'}))

//config de passport
server.use(passport.initialize());
server.use(passport.session());

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});


server.engine('html', swig.renderFile);
server.set('view engine', 'html');
server.set('views', __dirname + '/app/views');

server.use(express.static('./public'));

require('./app/controllers/home')(server);
require('./app/controllers/user')(server, io);
require('./app/controllers/discuss')(server, io);

require('./app/connections/facebook')(server);
require('./app/connections/twitter')(server);
