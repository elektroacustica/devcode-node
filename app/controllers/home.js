var Question = require('../models/question');

var homeController = function(server) {

	server.route('/')
		.get(function (req, res){
			Question
			.find({})
			.populate('user')
			.limit(5)
			.sort('-created')
			.exec(function (error, question){
				if (req.user) {
					if (req.user.provider == 'facebook') {
						var name = req.user._json.first_name;
						var url_foto = 'http://graph.facebook.com/'+req.user.id+'/picture';	
					}
					if (req.user.provider == 'twitter') {
						var name = req.user.username;
						var url_foto = req.user.photos[0].value;	
					}
					res.render('home/index', {
						name: name,
						url_foto: url_foto,
						questions: question
					});
				}
				else{
					res.render('home/index', {questions: question});
				}
				
			});
		});
};

module.exports = homeController;