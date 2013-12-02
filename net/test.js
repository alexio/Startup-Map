//Crunchbase oauth
var http = require('http'),
url = require('url'),
sys = require('sys');

var apikey = "jph7r5txz8vcshq3anwqu5w5";
var callbackURL = "198.211.114.151:5000";

http.createServer(function(req, res){
	res.writeHeader(200, {'Content-Type': 'text/plain'});
  	res.write('Hello World\n');
	res.end('Last bit');
	sys.puts("Test: " + JSON.stringify(req.headers));
}).listen(8980);

sys.puts("test");
console.log("Server running");
