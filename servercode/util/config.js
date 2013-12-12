_api_key = 'jph7r5txz8vcshq3anwqu5w5';
_api_key_new = '8jsmuem8jxqngc7jtqnb6wus';
_db = 'Startup_Map';

function api_key(){
	return _api_key_new; 
}

function db(){
	return  'mongodb://127.0.0.1:27017/'+_db;
}

module.exports = {
	
	api_key: function(){
		return api_key();
	},

	db: function(){
		return db();
	}
}
