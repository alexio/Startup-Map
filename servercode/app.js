/*
 * App for mappedinUSA
 */

 var express = require('express'),
     app = express(),
     mongoose = require('mongoose'),
     CompanyList = require('./db/schema').Company;

app.get('/hello.txt', function(req, res){
	var body = 'Hello World';
	res.send(body);
});

app.get('/company_list', function(req,res){
	
	var results = {};
	/*	CompanyList.find({name:'google'}, function(err, result){
		
		if(err) throw err;
		
		console.log("Results: " + JSON.stringify(result));
		results = result;
		res.send(JSON.stringify(results));
	});*/

	var q = CompanyList.find().limit(20);
	q.find(function(err, posts){
		if(err)throw err;
		res.send(JSON.stringify(posts));
	});

	console.log("Comp list");
});

app.listen(8787);
console.log('Listening on port 8787');
