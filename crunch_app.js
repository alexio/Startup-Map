/*
 * Used to grab data from Crunchbase api and populate a mongo db
 * In progress
 * */

var mongoose = require('mongoose'),
    config = require('./util/config'),
    crunchSchemas = require('./db/schema'),
    fs = require('fs'),
    crunchAPI = require('./net/crunchAPI'),
    EventEmitter = require('events').EventEmitter,
    theQueuer = new EventEmitter;

mongoose.connect(config.db());
console.log("Connecting to " + config.db() + "...");

var db = mongoose.connection;

db.on('error', console.error.bind(console,'DB Connection Problem'));
db.on('connected', function(){
	console.log("Connected");
});

var closeDB = function closeDB(){
	console.log("Closing DB...");
	db.close();
	console.log('closed');
}

theQueuer.on('closedb', closeDB);

/*Takes JSON array of objects with companySchema*/
var insertDB = function insertDB(data){
	console.log('Inserting into DB...');
	var Company = mongoose.model('Company', crunchSchemas.companySchema());
	
	for(var i = 0, len = data.length; i < len; i += 1){
		console.log("Inserting : " + i);
		console.log("Data: " + JSON.stringify(data[i]));
		try{
			console.log("In try");
			console.log(data[i]);
			var company = new Company(data);
			company.save(function(err){
				if (err) throw err;
				console.log("Inserted");
			});
		}
		catch(e){
			console.log("Invalid schema and/or db insert: " + e);
		}
	}
	
	Company.find(function (err, companies){
		if (err) throw err;
		//console.log(companies);
		console.log("Found all");
	});
	theQueuer.emit('closedb');
}

theQueuer.on('insertdb', insertDB);

var crunchdata = function crunchData(data){
	console.log('Callback...');
	theQueuer.emit('insertdb', data.slice(0, data.length - 100));
}

crunchAPI.Call('list', '', crunchdata);
