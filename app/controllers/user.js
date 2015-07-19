var User = require('../models/user'),
	logged = require('../midlewares/logged'),
	getuser = require('../midlewares/getuser');
var users = [];

var userController = function (server, io){

	var io2 = io.of('/chat');

	io2.on('connection', function (socket){
		socket.join('chat');
		socket.on('nuevo usuario', function (data){
			socket.broadcast.to('chat').emit('devolviendo usuario', data);
		});

		socket.on('nuevo mensaje', function (data){
			io2.to('chat').emit('devolviendo mensaje', data);
		});
	});




	server.route('/logout')
		.get(getuser, function (req,res){
			users = users.filter(function (el){
				return el.username !== req.user.username;
			});
			io2.in('chat').emit('logout', req.user);
			req.logout();
			res.redirect('/');
		});

	server.get('/extra-data', function (req, res){
		User.findOne({id_network: req.user.id}, function (error, user){
			if (user) {
				res.redirect('/');
				return;
			}
			else{
				res.render('user/extra_data')
			}
		});
	});

	server.post('/extra-data', function (req, res){
		if (req.user.provider == 'facebook') {
			console.log(req.user);
			var user = new User({
				id_network: req.user.id,
				username: req.body.username,
				email: req.body.email,
				first_name: req.user.name.givenName,
				last_name: req.user.name.familyName,
				url_foto: 'http://graph.facebook.com/'+req.user.id+'/picture'
			});
			user.save(function (error){
				if (error) {
					console.log('error');
					return;
				}
			});
		}
		if (req.user.provider == 'twitter') {
			var user = new User({
				id_network: req.user.id,
				username: req.body.username,
				email: req.body.email,
				first_name: req.user.displayName,
				url_foto: req.user.photos[0].value
			});
			user.save(function (error){
				if (error) {
					console.log('error');
					return;
				}
			});	
		}

		res.redirect('/');
	});

	server.get('/chat',logged, getuser, function (req, res){

		var user = {
			username: req.user.username,
			url_foto: req.user.url_foto
		};
		users.push(user);
		res.render('user/chat', {users: user, user: req.user.usename, foto: req.user.url_foto});
	});

};

module.exports = userController;