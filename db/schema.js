var mongoose = require('mongoose');

function companySchema(){
	
	var _companySchema = mongoose.Schema({
		name: String,
		permalink: String,
		category_code: String
	});

	//consider adding methods
	return _companySchema;
}


module.exports = {
	
	companySchema: function(){
		return companySchema();
	}
}
