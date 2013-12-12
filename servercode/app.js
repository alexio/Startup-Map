/*
 * App for mappedinUSA
 */

 var express = require('express'),
     app = express(),
     CompanyList = require('./db/schema').List;

app.get('/hello.txt', function(req, res){
	var body = 'Hello World';
	res.send(body);
});

app.get('/company_list', function(req,res){
	
	var results = {};
	CompanyList.find({}, function(err, result){
		results = result;
	});

	res.send(JSON.stringify(results));
});

app.listen(8787);
console.log('Listening on port 8787');
