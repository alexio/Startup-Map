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
	console.log("Origin");	
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
	
	if(req.query.query !== undefined){
		var data_response = {
			twitter: [],
			nyt_news: [],
			tc_news: []
		}
		var count = 0;
		twitterAPI.timeline(req.query.query, function(data){
			console.log("Sending t back: " + count);
			data_response.twitter = data;
			count++;
			if(count == 3){
				res.send(JSON.stringify(data_response));
			}
		});
		nytAPI.articles(req.query.query, function(data){
			console.log("Sending ny back: " + count);
			data_response.nyt_news = data;
			count++;
			if(count == 3){
				res.send(JSON.stringify(data_response));
			}
		});
		news.articles(req.query.query, function(data){
			console.log("Sending tc back: " + count);
			data_response.tc_news = data;
			count++;
			if(count == 3){
				res.send(JSON.stringify(data_response));
			}
		});
	}
	else{
		res.send({error:'Invalid query'});
	}
});

/*
 * News Call
 * */
app.get('/n', function(req, res){

	if(req.query.query !== undefined){
		nytAPI.articles(req.query.query, function(data){
			res.send(JSON.stringify(data));
		});
	}
	else{
		res.send({error:'Invalid json or something else'});
	}
});

app.get('/tc', function(req, res){

	if(req.query.query !== undefined){
		news.articles(req.query.query, function(data){
			res.send(JSON.stringify(data));
		});
	}
	else{
		res.send({error:'Invalid JSON or something else'});
	}
});

app.listen(8989);
console.log('Listening on port 8787');
