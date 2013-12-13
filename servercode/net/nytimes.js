var http = require('http'),
    qs = require('querystring'),
    config = require('../util/config');

function get_ops(method, path){	
	var options = {
		method:method,
		host:'api.nytimes.com',
		path:path
	}

	return options;
}

function articles(query, callback){
	
	console.log("nytkey: " + config.nytKey);
	console.log("q: " + query);
	var path = '/svc/search/v2/articlesearch.json?q='+query+'&api-key='+config.nytKey;

	request(get_ops('GET', path), function(data){
			
		var news = [];

		data.response.docs.forEach(function(article){
			
			var entry = {
				url:article.web_url,
				snippet:article.snippet,
				source:article.source,
				date:article.pub_date,
			}

			news.push(entry);
		});
		callback(news);
	});
}

function request(options, callback){

	var req = http.request(options, function(res){
		
		console.log("Status code: " + res.statusCode);
		console.log('Headers: ' + JSON.stringify(res.headers));

		var body = '';

		res.setEncoding('utf8');

		res.on('error', function(err){
			console.log("Error in nyt res");
		});

		res.on('data', function(chunk){
			body+=chunk;
		});

		res.on('end', function(){

			try{
				var data = JSON.parse(body);
				callback(data);

			}catch(e){
				console.log("Parsing error in NYT request");
			}
		});
	});

	req.on('error', function(e){
		console.log("Error: " + e.message);
	});

	req.end();
}

module.exports = {

	articles: function(query,callback){
		return articles(query,callback);
	}
}
