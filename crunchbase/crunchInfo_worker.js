/*
 * Will collect specific information on the companies retrieved by crunchList_worker.js
 */

var mongoose = require('mongoose'),
    config = require('../util/config'),
    schema = require('../db/schema'),
    crunchAPI = require('../net/crunchAPI');

var db =  mongoose.connection;

db.on('error', console.error.bind(console, 'DB Connection Problem'));

var count = 0;

var addInfoToDB = function addInfoToDB(data){

	console.log("Exec callback");
	if(data == 'error'){
		console.log('Error in response data');
		return;
	}
	
	db.on('open', function(err){
		
		if(err) throw err;

		var Info = mongoose.model('company_info', config.infoSchema(), 'company_info');
		console.log("Getting office");	
		var _offices = [];
		for(var i, len = data.offices.length; i < len; i+=1){
			
			var place = {
				desc: data.offices[i].description,
				address: data.offices[i].address1,
				city: data.offices[i].city,
				state: data.offices[i].state_code,
				country: data.offices[i].country_code,
				lat: Number(data.offices[i].latitude),
				lon: Number(data.offices[i].longitude)
			}
			_offices.push(place);
		}
	
		console.log("Creating Entry");
		var entry = new Info({
			name: data.name,
			homepage: data.homepage_url,
		    	twitter_handle: data.twitter_username,
		    	category: data.category_code,
		    	employee_num: data.number_of_employees,
		    	founded: String(data.founded_month+'-'+data.founded_day+'-'+data.founded_year),
		    	tags: data.tag_list,
		    	email: data.email_address,
		    	image: data.image.available_sizes[0][1],
		    	offices: _offices
		});
	
		console.log("entry made");
		entry.save(function(err, result){

			if(err){
				console.log("error during save");
				return console.error(err);
			}

			count+=1;
			console.log("Count: " + count);
		});
	});

	mongoose.connect(config.db());
}
//comment

db.on('open', function(err){
	if (err) {
		console.log("Error in db open");
		throw err;
	}

	var Company = mongoose.model('company_list', schema.companySchema(),'company_list');

	var query = Company.find({},function(err, result){
		if(err) throw err;
		
		for(var i = 0, len = result.length, len = 1; i < len; i++){
			console.log('Test? ' + JSON.stringify(result[i]));
			crunchAPI.getInfo(result[i].name.toLowerCase(), 'company', addInfoToDB);
		}
		console.log("Total : " + i);
		db.close();
	});

});

mongoose.connect(config.db());

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});
