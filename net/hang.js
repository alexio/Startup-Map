var fs = require('fs'),
    mongoclient = require('mongodb').MongoClient,
    EventEm = require('events').EventEmitter,
    q = new EventEm;

mongoclient.connect('mongodb://127.0.0.1:27017/companies', function(err, db){
	if (err) throw err;

	db.createCollection('company_shallow', function(err, coll){
	});
		var closeDB = function closeDB(){
			db.close();
			console.log("Closing");
		}

		q.on('closedb', closeDB);
});


var reader = function reader(){
	fs.readFile('file.txt', function(err, str){
		if (err) throw err;

		console.log("Stuff: " + str);
		q.emit('closedb');
	});
}

q.on('read', reader);

fs.exists("file.txt", function(exists){
	if(exists){
		q.emit('read');
	}
});
