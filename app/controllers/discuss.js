var User = require('../models/user');
var Question = require('../models/question');
var Answer = require('../models/answer');
var logged = require('../midlewares/logged');
var getUser =  require('../midlewares/getuser');
var slugs = require('slugs');

 var discussController = function (server, io){

 	io.on('connection', function (socket){
 		socket.join('home');
 	});

 	server.post('/guardar-pregunta', logged, getUser, function (req,res){
	 		var question = new Question({
	 			user: req.user,
	 			title: req.body.title,
	 			content: req.body.content,
	 			slug: slugs(req.body.title)
	 		});
	 		question.save(function (error){
	 			if (error) {
	 				console.log('error');
	 				return;
	 			}
	 			io.to('home').emit('preguntando', {
	 				username: req.user.username,
	 				url_foto: req.user.url_foto,
	 				content: req.body.content,
	 				created: question.created
	 			});
	 		});
			res.redirect('/');
 	});

 	server.get('/pregunta/:slug', function (req,res){
 		Question.findOne({slug: req.params.slug})
 		.populate('user')
 		.exec(function (error, question){
 			Answer
 			.find({question: question})
 			.populate('user')
 			.sort('created')
 			.exec(function (error, answers){
 				res.render('discuss/question_detail', {question: question, answer: answers});
 				
 			});
 		});
 	});

 	server.post('/pregunta/:slug', logged, getUser, function (req,res){
 		Question.findOne({slug: req.params.slug})
 		.populate('user')
 		.exec(function (error, question){
	 		var answer = new Answer({
	 			question: question,
	 			user: req.user,
	 			content: req.body.content
	 		});
	 		answer.save(function (error){
	 			if (error) {
	 				console.log('error')
	 				return;
	 			}
	 			io.to('home').emit('preguntando',{
	 				username: req.user.username,
	 				url_foto: req.user.url_foto,
	 				content: req.body.content,
	 				created: question.created
	 			})
	 		});
	 		res.redirect('/pregunta/'+req.params.slug);
 		});
 	});

 };

 module.exports = discussController;