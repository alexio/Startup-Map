crunchbase_apikey = 'jph7r5txz8vcshq3anwqu5w5';
_twitter_consumerkey = 'bAX6SAXBUuBTPTA706XvQ';
_twitter_secretkey = 'mPCnWnbQ0NN6BrAW8co9e8iCqcAszdWYK6MIkXpUg';
_nyt_key = '1ff0467f93f9029cdd3253b69b81d6c9:1:66215971';
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
