var mongoose = require('mongoose');

function companySchema(){
	
	var _companySchema = mongoose.Schema({
		name: String,
		category: String
	});

	//consider adding methods
	return _companySchema;
}

//Detailed info about the company
function infoSchema(){

	var infoSchema = mongoose.Schema({
		name: String,
	    	homepage: String,
	    	twitter_handle: String,
	    	category: String,
		employee_num: Number,
	    	founded: String, // month-day-year
	    	tags: String,
	    	email: String,
	    	image: String,
	    	offices: [{
			desc: String,
	    		address: String,
	    		city: String,
	    		state: String,
	    		country: String,
	    		lat: Number,
	    		lon: Number
		}]
	});

	//consider adding class.methods.*
	return infoSchema;
}


module.exports = {
	
	companySchema: function(){
		return companySchema();
	},

	infoSchema: function(){
		return infoSchema();
	}
}
