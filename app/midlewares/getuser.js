var User =  require('../models/user');
 
var getuser =  function (req, res, next){
	User.findOne({ id_network: req.user.id}, function (error, user){
		req.user = user;
		next();
	})
 };

 module.exports = getuser;