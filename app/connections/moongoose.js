var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/devask');

module.exports = mongoose;