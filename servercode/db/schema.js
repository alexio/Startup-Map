var mongoose = require('mongoose'),
    config = require('../util/config');

var companySchema = new mongoose.Schema({
        name: String,
        category: String
});

//Detailed info about the company
var infoSchema = new mongoose.Schema({
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

mongoose.connect(config.db());

module.exports.List = mongoose.model('company_list', companySchema,'company_list');
module.exports.Company = mongoose.model('company_info',infoSchema);
