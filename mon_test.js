var mongoose = require('mongoose'),
    config = require('./util/config'),
    schemar = require('./db/schema');

var db = mongoose.connection;

db.on('error', console.error);
db.on('open', function(){
console.log("connected");

	// Compile a 'Movie' model using the movieSchema as the structure.
	// Mongoose also creates a MongoDB collection called 'Movies' for these documents.
	var Movie = mongoose.model('Company', schemar.companySchema());
	console.log("Got here");		
	var thor = new Movie({
		  name: 'Thor2'
		, permalink: 'PG-13'
		, category_code: '2011'  // Notice the use of a String rather than a Number - Mongoose will automatically convert this for us.
	});
	
	thor.save(function(err, thor) {
		  if (err) return console.error(err);
		  console.dir(thor);

		db.close();
	});

});

mongoose.connect('mongodb://127.0.0.1:27017/companies');
