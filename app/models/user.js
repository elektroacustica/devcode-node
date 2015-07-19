var moongoose = require('../connections/moongoose');

var Schema = moongoose.Schema;

var userScheca = new Schema({
	id_network: {type: String},
	username: {type: String, required: true, index: {unique: true}},
	email: {type: String, required: true},
	first_name: {type: String},
	last_name: {type: String},
	url_foto: {type: String}
});

var User = moongoose.model('user', userScheca);

module.exports= User;