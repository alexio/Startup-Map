var schemar = require('./db/schema'),
    crunchApi = require('./net/crunchAPI'),
    mongoose = require('mongoose');

var callback = function callback(data){
	console.log("Resulting: " + data.name);
}

crunchApi.getInfo('google', 'company', callback);



