/*
 * Used to grab data from Crunchbase api and populate a mongo db
 * In progress
 * */

var mongoose = require('mongoose'),
    config = require('../util/config'),
    schema = require('../db/schema'),
    fs = require('fs'),
    crunchAPI = require('../net/crunchAPI'),
    EventEmitter = require('events').EventEmitter,
    theQueuer = new EventEmitter;

var currentIndex = process.argv[2];
var endIndex = process.argv[3];

console.log("C : " + currentIndex + " E: " + endIndex);
var db = mongoose.connection;

db.on('error', console.error.bind(console,'DB Connection Problem'));

/*Takes JSON array of objects with companySchema*/
var crunchData = function crunchData(data){
	console.log("Crunching!");
	//check data if valid json
	db.on('open', function(err){
		var insert_count = 0;	
		var Company = mongoose.model('Company', schemas.companySchema());
		
		var i = Number(currentIndex);
		var len = i+Number(endIndex);
		if(len > data.length){
			len = data.length;
		}

		if(i >= data.length){
			db.close();
			return;
		}

		for(; i < len; i += 1){
			console.log("Index: " + i + " Data: " + JSON.stringify(data[i]));
			
			var company = new Company({
				name: data[i].name, 
			    	category: data[i].category_code
			});

			company.save(function(err, result){
				if (err){
					 insert_count+=1;
					 return console.error(err);
				}
				insert_count+=1;
				console.dir(result);
				console.log('Close? ' + i + ' ' + len);
				if(insert_count == endIndex){
					console.log('Close Db: ' + insert_count);
					db.close();
				}
			});
		}
	});

	mongoose.connect(config.db());
}

crunchAPI.getList('companies',crunchData);
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});
