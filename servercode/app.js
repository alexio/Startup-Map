/*
 * App for mappedinUSA
 */

 var express = require('express'),
     app = express(),
     mongoose = require('mongoose'),
     CompanyList = require('./db/schema').List,
     Company = require('./db/schema').Company,
     twitterAPI = require('.net/twitter');

app.get('/hello.txt', function(req, res){
	var body = 'Hello World';
	res.send(body);
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

	var body = '';
	req.on('data', function(chunk){
		body+=chunk;
	});
	
	req.on('end', function(err){
		
		if(err) throw err;
	
		console.log("/t body: " + body);
		twitterAPI.timeline("google", function(data){
			res.send(JSON.stringify(data));
		});
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
	});

});

app.listen(443);
console.log('Listening on port 8787');
