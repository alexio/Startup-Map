_api_key = 'your key';
_db = 'your db';

function api_key(){
	return _api_key; 
}

function db(){
	return _db;
}

module.exports = {
	
	api_key: function(){
		return api_key();
	},

	db: function(){
		return db();
	}
}
