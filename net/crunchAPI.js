var http = require('http'),
    qs = require('querystring'),
    config = require('../util/config');

var host = 'api.crunchbase.com';

function entity_list(){
	return '/v/1/companies.js?'+qs.stringify({api_key:config.api_key()}); 
}

function entity_info(name, entity){
	return '/v/1/'+company+'/'+name+'.js?';
}

function makeApiCall(type, name, callback){

	var options = {
                hostname: 'api.crunchbase.com',
                path:''
        }

	switch(type){
		case 'list':
			options.path = entity_list();
			break;
		case 'info':
			//passing in 'company'
			options.path = entity_info(name,'company');
			break;
		default:
			return;
	}
	
        var req = http.request(options, function(res) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                var body = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                        body+=chunk;
                });
                res.on('end', function(){

                        try{
                                /*Very large object, send in bits*/
                                var data = JSON.parse(body);
                                /*var data = [{
                                        name:'Google',
                                        permalink:'googley',
                                        category_code:'web'
                                }];*/

				callback(data);
                        }
                        catch(e){
				callback('error');
                                console.error("Parsing error in res: ", e);
                        }
                });
		res.on('error', function(e){
			console.log('Error in response');
		});
        });

        req.on('error', function(e) {
                console.log('Shit hit the fan: ' + e.message);
        });

        req.end();
}

module.exports = {

	Call: function(type,name,callback){
		return makeApiCall(type,name,callback);
	}
}
