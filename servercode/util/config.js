_crunchbase_apikey = '8jsmuem8jxqngc7jtqnb6wus';
_twitter_consumerkey = 'bAX6SAXBUuBTPTA706XvQ';
_twitter_secretkey = 'mPCnWnbQ0NN6BrAW8co9e8iCqcAszdWYK6MIkXpUg';
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

module.exports = {
	crunch_key: function(){
		return _crunchbase_apikey();
	},
		
	twitter_keys: function(){
		return twitterKeys();
	},
			
	db: function(){
		return db();
	}
}
