var http = require('http'),
    mongoclient = require('mongodb').MongoClient,
    format = require('util').format,
    qs = require('querystring')
    config = require('../util/config');

var apikey = config.api_key();
console.log(apikey);

var options = {
	hostname: 'api.crunchbase.com',
	path:'/v/1/companies.js?'+qs.stringify({api_key:apikey})
}

mongoclient.connect('mongodb://127.0.0.1:27017/test', function(err,db){
	
	if(err)	throw err;

	var coll = db.collection('test_insert');
	coll.insert({a:2}, function(err,docs){
		coll.count(function(err,count){
			console.log(format("count = %s",count));
		});
	});

	coll.find().toArray(function(err, results){
		console.dir(results);
		db.close();
	});
});
//getCompanies(options);

function getCompanies(ops){
	
	var req = http.request(ops, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		var body = 'Body: ';
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			body+='\n\n' +chunk;
		});
		res.on('end', function(){
			console.log(body);
		});
	});
	
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	req.on('response', function(response){
		console.log("first " + response.toString());
		//console.log("response " +JSON.stringify(response)); 
	});

	req.on('end', function(){
		console.log("end");
	});

	req.end();
}
