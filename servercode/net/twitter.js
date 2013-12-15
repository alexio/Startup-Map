var https = require('https'),
    qs = require('querystring'),
    stream = require('stream').Writable,
    qs = require('querystring'),
    keys = require('../util/config').twitter_keys();

function getOps(path, method){
	
	var options = {
		method: method,
                hostname: 'api.twitter.com',
                path:path
	}

	return options;
}

/*Get list of tweets from specified user*/
function timeline(screen_name, callback){
	
	console.log('Got timeline');
	getBearerToken(function(data){
                    
                var path = '/1.1/statuses/user_timeline.json?screen_name=' + screen_name + '&count=10'; 
                var auth = "Bearer " + data.access_token;
                makeRequest(getOps(path,'GET'), auth, '', function(data){
			var theChosen = [];
			
			data.forEach(function(tweet){
				
				var text = '';
				if(tweet.text !== undefined){
					text = tweet.text;
				}

				var date = '';
				if(tweet.created_at !== undefined){
					date = tweet.created_at;
				}

				var author = '';
				if(tweet.user !== undefined && tweet.user.name != undefined){
					author = tweet.user.name;
				}

				var img = '';
				if(tweet.user !== undefined && tweet.user.profile_image_url){
					img = tweet.user.profile_image_url;
				}
				
				var entry = {
					tweet:text,
					date:date,
					author:author,
					profile_img:img
				};
				theChosen.push(entry);
			});

			callback(theChosen);
		});
        }); 
}

function search(query, callback){
	
	getBearerToken(function(data){
		
		var path = '/1.1/search/tweets.json?q=' + query + '&count=1';
		
		var auth = "Bearer " + data.access_token;
		makeRequest(getOps(path,'GET'), auth, '', function(data){
			var theChosen = [];
			
			data.forEach(function(tweet){
				var entry = {
					tweet:tweet.text
				}
				theChosen.push(entry);
			});
			console.log("Tweet result: ");
			console.log(theChosen);
			callback(theChosen);	
		});
	});
}

function getBearerToken(callback){
	
	var path = '/oauth2/token';

	var encodedKeys = new Buffer(keys.consumer+':'+keys.secret).toString('base64');
	var auth = "Basic " + encodedKeys;
	var body = "grant_type=client_credentials";
	
	makeRequest(getOps(path, 'POST'), auth, body,callback);
}

function makeRequest(options, auth, body,callback){	
	
        var req = https.request(options, function(res) {
		
                console.log('STATUS: ' + res.statusCode);
                //console.log('HEADERS: ' + JSON.stringify(res.headers));
		
		var body = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                        body+=chunk;
                });
                res.on('end', function(){
			try{
				var data = JSON.parse(body);
				callback(data);
			}
                        catch(e){
                                console.error("Parsing error in res: ", e);
                       		return 'error';
			}
                });
		res.on('error', function(e){
			console.log('Error in response');
		});
        });

	req.setHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
	req.setHeader('Authorization', auth);

	req.write(body);
	
	req.on('error', function(e) {
                console.log('Shit hit the fan: ' + e.message);
        });
	
	req.end();
	console.log(options.path);
}

module.exports = {
	
	search: function(query, callback){
		return search(query,callback);
	},

	timeline: function(screen_name, callback){
		return timeline(screen_name, callback);
	}
}
