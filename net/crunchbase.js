var http = require('http'),
    mongoclient = require('mongodb').MongoClient,
    format = require('util').format,
    qs = require('querystring'),
    config = require('../util/config'),
    fs = require('fs'),
    EventEmitter = require('events').EventEmitter,
    theQueuer = new EventEmitter;

var api_key = config.api_key();

var options = {
	hostname: 'api.crunchbase.com',
	path:'/v/1/companies.js?'+qs.stringify({api_key:api_key})
}

mongoclient.connect('mongodb://127.0.0.1:27017/companies', function(err,db){
	
	if(err)	throw err;
	
	db.createCollection('company_shallow', function(err, coll){

		/*Takes JSON*/
		var addToDB = function addToDB(data){

			for(var i = 0; i < companies.length; i ++){
				coll.insert(data, function(err,docs){

					if (err) throw err;
					coll.count(function(err,count){

						if (err) throw err;
						console.log("Count: " + format("count = %s",count));
					});
				});
			}
		}

		var closeDB = function closeDB(){
			coll.find().toArray(function(err, results){
				console.dir(results);
				db.close();
			});
		}

		theQueuer.on('close', closeDB);
		theQueuer.on('insert', addToDB);
	});
});

var clist_path = '../db/company_list.json';

var readJSONFile = function readJSONFile(){
	
	fs.readFile(clist_path, function(err, str){
		if (err) throw err;
		try{
			var data = JSON.parse(str);
			theQueuer.on('insert', data);
		}
		catch(e){
			console.error('Parsing error in read', e);
		}
	});
	console.log("end of read");
}

theQueuer.on('read',readJSONFile);

var writeJSONtoFile = function writeJSONtoFile(data){
	
	try{
		var len = data.length;
		if(len < 10){
			len = 0;
			console.log("Stuff: " + JSON.stringify(data));
		}

		for(var i = 0; i < len; i++){
			var str = JSON.stringify(data[i]);
			fs.appendFile(clist_path, str, function(err){
				if (err) throw err;
				console.log('Json written');
			});
		}
		console.log("End of all things");
	}
	catch(e){
		console.error("Parsing error in write", e);
	}
	console.log("End!");
}

theQueuer.on('write', writeJSONtoFile);

function getCompanies(ops){
	
	var req = http.request(ops, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		var body = '';
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			body+=chunk;
		});
		res.on('end', function(){

			try{
				/*Very large object, send in bits*/
				var data = JSON.parse(body);
				
				var interval = Math.floor(data.length/10);
				for(var i = 0; i < data.length; i+=interval){
					var slice = data.slice(i, i+interval-1);
					console.log("Writing slice: " + i + " len: " + slice.length);
					theQueuer.emit('write', slice);
				}
			}
			catch(e){
				console.error("Parsing error in res: ", e);
			}
		});
	});
	
	req.on('error', function(e) {
		console.log('Shit hit the fan: ' + e.message);
	});

	req.end();
}

fs.exists(clist_path, function(exists){
	if(exists){
		theQueuer.emit('read');
	}
	else{
		getCompanies(options);
		console.log("THE VOID");
	}
	theQueuer.emit('close');
});
