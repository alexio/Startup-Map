crunchbase_apikey = 'crunch base key';
_twitter_consumerkey = 'twitter consumer key';
_twitter_secretkey = 'twitter secret key';
_nyt_key = 'nyt key';
_db = 'Startup_Map';

function crunchbase_apikey(){
	return _crunchbase_apikey;
}

function db(){
        return  'mongodb://127.0.0.1:27017/'+_db;
}

function twitterKeys(){

	var keys = {
		consumer: _twitter_consumerkey,
		secret: _twitter_secretkey
	};

	return keys;
}

/*new york times*/

module.exports = {
	crunch_key: function(){
		return crunchbase_apikey;
	},
		
	twitter_keys: function(){
		return twitterKeys();
	},
			
	db: function(){
		return db();
	},

	nytKey:_nyt_key
}
