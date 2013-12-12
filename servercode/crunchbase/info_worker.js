/*
 * Will collect specific information on the companies retrieved by crunchList_worker.js
 *
*/

var mongoose = require('mongoose'),
    config = require('../util/config'),
    Company = require('../db/schema').Company,
    CompanyList = require('../db/schema').List,
    crunchAPI = require('../net/crunchAPI');

var startIndex = process.argv[2];
var endIndex = process.argv[3];

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

		var _offices = [];
		if(data.offices != null){

			for(var i = 0, len = data.offices.length; i < len; i+=1){
		

				var place = {
					desc: data.offices[i].description,
					address: data.offices[i].address1,
					city: data.offices[i].city,
					state: data.offices[i].state_code,
					country: data.offices[i].country_code,
					lat: Number(data.offices[i].latitude),
					lon: Number(data.offices[i].longitude)
				}
				console.log("Place: " + JSON.stringify(place));
				_offices.push(place);
			}
		}
	
		console.log("Creating Entry");
		var company = new Company();
		company.name = data.name,
                company.homepage = data.homepage_url,
                company.twitter_handle = data.twitter_username,
                company.category = data.category_code,
                company.employee_num = data.number_of_employees,
                company.founded = String(data.founded_month+'-'+data.founded_day+'-'+data.founded_year),
                company.tags = data.tag_list;
                company.email = data.email_address;
	
		console.log("Image json: " + JSON.stringify(data.image));
		if(data.image != null && data.image.length != 0 && data.image.available_sizes != null && data.image.available_sizes[0].length != 0){
                	company.image = data.image.available_sizes[0][1];
		}

		company.offices = _offices;

                console.log("entry made");
                company.save(function(err, result){

                        if(err){
                                console.log("error during save");
                                return console.error(err);
                        }

                        count+=1;
                        console.log("Count: " + count);
                	db.close();
		});

	});
	mongoose.connect(config.db());
}
//comment

//db.on('open', function(err){
//	if (err) {
//		console.log("Error in db open");
//		throw err;
//	}

console.log("Trying...");
	CompanyList.find({},function(err, result){
		if(err) throw err;
		console.log("Got data...");
		
		var len = result.length;
		if(endIndex != undefined){
			len = endIndex;
		}

		for(i = startIndex; i < len; i++){
			crunchAPI.getInfo(result[i].name.toLowerCase(), 'company', addInfoToDB);
		}
		console.log("Total : " + i);
		db.close();
	});

//});

//mongoose.connect(config.db());

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});
