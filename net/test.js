var fs = require('fs'),
    mongoclient = require('mongodb').MongoClient,
    EventEm = require('events').EventEmitter,
    q = new EventEm;

mongoclient.connect('mongodb://127.0.0.1:27017/companies', function(err,db){

	if(err) throw err;
			
	db.createCollection('company_shallow', function(err, coll){
	/*Takes JSON*/
		var addToDB = function addToDB(data){
			for(var i = 0; i < companies.length; i ++){
				coll.insert(data, function(err,docs){
					if (err) throw err;
					coll.count(function(err,count){	
						if (err) throw err;	
						console.log("Count: " + format("count = %s",count));
					});											});
			}
		}
		var closeDB = function closeDB(){
			console.log("Closing");		
			coll.find().toArray(function(err, results){	
				console.log("Print and CLose");	
				console.dir(results);
				db.close();	
			});
		}
		theQueuer.on('close', closeDB);
		theQueuer.on('insert', addToDB);	
		//db.close();
	});
});

var reader = function reader(){
	fs.readFile('file.txt', function(err, str){
		if (err) throw err;

		console.log("Stuff: " + str);
	});
}


q.on('read', reader);

fs.exists("file.txt", function(exists){
	if(exists){
		q.emit('read');
	}
});

