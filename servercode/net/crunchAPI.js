var http = require('http'),
    qs = require('querystring'),
    config = require('../util/config');

/*getArticles("google","company", function(data){
	console.log("Data: ");
	console.log(data);
});*/

function entity_list(entity,callback){
	var path =  '/v/1/'+entity+'.js?'+qs.stringify({api_key:config.crunch_key()}); 
	var data = apiCall(path, callback); 
}

function entity_info(name, entity, callback){
	var path = '/v/1/'+entity+'/'+name+'.js?'+qs.stringify({api_key:config.crunch_key()});
	var data = apiCall(path, callback);
}

function getArticles(name,callback){

	var path = '/v/1/company/'+name+'.js?'+qs.stringify({api_key:config.crunch_key()});
	apiCall(path, function(data){
		console.log("Funding");
		var articles = [];
		data.funding_rounds.forEach(function(article){
			console.log(article);	
			if(article.source_url != '' && article.source_description != ''){
				console.log("Push");
				var entry = {
					desc: article.source_description,
					link: article.source_url
				}
				articles.push(entry);
			}
		});
		callback(articles);
	});
}

function apiCall(url, callback){
	//console.log("url: " + url);
	var options = {
                hostname: 'api.crunchbase.com',
                path:url
        }

        var req = http.request(options, function(res) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                var body = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                        body+=chunk;
                });
                res.on('end', function(){
                        //console.log("Body: " + body);
			try{
				/*Very large object, send in bits*/              
				//console.log("Parsei " + body);
				var data = JSON.parse(body);
				console.log("Len: " + data.length);
				callback(data);
			}
                        catch(e){
				return 'error';
                                console.error("Parsing error in res: ", e);
                        }
                });
		res.on('error', function(e){
			console.log('Error in response');
		});
        });

        req.on('error', function(e) {
                console.log('Shit hit the fan: ' + e.message);
        });

        req.end();
}

module.exports = {
	
	getList: function(entity, callback){
		return entity_list(entity, callback);
	},

	getInfo: function(name, entity, callback){
		return entity_info(name, entity, callback);
	},

	articles: function(name, callback){
		return getArticles(name,callback);
	}
}
