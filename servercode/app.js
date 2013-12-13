/*
 * App for mappedinUSA
 */

 var express = require('express'),
     app = express(),
     mongoose = require('mongoose'),
     CompanyList = require('./db/schema').List,
     Company = require('./db/schema').Company,
     twitterAPI = require('./net/twitter'),
     nytAPI = require('./net/nytimes'),
     news = require('./net/crunchAPI');

app.use(express.logger('dev'));
app.use(express.bodyParser());

// Enables CORS
app.all('*', function(req, res, next) {
	if(!req.get('Origin')) return next();
	
	res.header('Access-Control-Allow-Origin', 'http://198.211.114.151');
	res.header('Access-Control-Allow-Methods', 'GET,POST');
	res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
 
    	// intercept OPTIONS method
    	if ('OPTIONS' == req.method) {
		return res.send(200);
   	 }
	else {
		next();
	}
});

app.get('/cl', function(req,res){
	
	/*	CompanyList.find({name:'google'}, function(err, result){
		
		if(err) throw err;
		
		console.log("Results: " + JSON.stringify(result));
		results = result;
		res.send(JSON.stringify(results));
	});*/

	var q = Company.find();
	q.find(function(err, posts){
		if(err)throw err;
		res.send(JSON.stringify(posts));
	});
});

app.get('/ci', function(req,res){

	var body = '';
	req.on('data', function(chunk){
		body+=chunk;
	});

	req.on('end', function(err){

		if(err) throw err;
	
		console.log("Req body: " + body);
	});
});

/* 
 *Twitter call
 */
app.get('/t', function(req, res){
	console.log("q: " + req.query.query);
	var body = '';
	req.on('data', function(chunk){
		body+=chunk;
	});
	
	req.on('end', function(err){
		
		if(err) throw err;
	
		console.log("/t body: " + body);
		try{
			var query = JSON.parse(body);
			console.log(query);
			twitterAPI.timeline(body.query, function(data){
				res.send(JSON.stringify(data));
			});
		}catch(e){
			res.send({error:'Invalid json (get better). But error could be something else'});
		}
	});
});

/*
 * News Call
 * */
app.get('/n', function(req, res){

	var body = '';
	req.on('data', function(chunk){
		body+=chunk;
	});

	req.on('end', function(err){

		if(err) throw err;
	
		console.log("Req body: " + body);

		try{
			var query = JSON.parse(body);
			console.log('JSON: ' + query);
			nytAPI.articles(query, function(data){
				res.send(JSON.stringify(data));
			});
		}catch(e){
			res.send({error:'Invalid json or something else'});
		}
	});
});

app.get('/tc', function(req, res){

	var body = '';
	req.on('data', function(chunk){
		body+=chunk;
	});

	req.on('end',function(err){
			
		if(err) throw err;

		console.log("techc body: " + body);
		
		try{
			var query = JSON.parse(body);
			news.articles(query, function(data){
				res.send(JSON.stringify(data));
			});

		}catch(e){
			res.send({error:'Invalid JSON or something else'});
		}
	});
});

app.listen(443);
console.log('Listening on port 8787');
