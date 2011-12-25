var http = require('http'),
express = require("express"),
fs = require('fs'),
url = require('url'),
util = require('util'),
path = require('path'),
WEBROOT = path.join(path.dirname(__filename), '/webroot'),
redislib = require('redis');

if (process.env.REDISTOGO_URL) {
	var rtg   = url.parse(process.env.REDISTOGO_URL);
	var redis = redislib.createClient(rtg.port, rtg.hostname);
	redis.auth(rtg.auth.split(":")[1]);
	redis.get('count', function(err, res){
		//console.log(res)
	});
} else {
	//var redis = redislib.createClient();
}

//Create express server
var app = express.createServer(express.logger());
app.use('/static',express.static(WEBROOT));

//Define route for the homepage
app.get('/:hex', function (req, response) {
   fs.readFile(WEBROOT+'/index.html', function (err, data) {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.write(data);
        response.end();
    });
});

app.get('/add', function (req, response) {
	redis.INCR('count', function(err, res){
        var num = res,
		base64 = decToBase64(num);
		console.log('num: ' + num);
		console.log('base: ' + base64);
		redis.SET(
			base64,
			{
				url:req.query['url'],
				email: req.query['email']
			},
			function(){
				response.write('{url:'+base64+'}');
				response.end();
		});
    });
});

app.get('', function (req, response) {
   //redis.get('
   //var redirect = look up hex;
   //redirect user
   //ssendEmail
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

function decToBase64 (num){
	var start = Math.ceil(Math.log(num)/Math.log(64)) +1,
	base64Str = "abcdefghijklmnopqrstuvwyxABCDEFGHIJKLMNOPQRSTUVWYX0123456789",
	base64 = "",
	power = 0;
	//console.log(start)
	while (start+1){
		power = Math.pow(64,start);
		console.log(power);
		console.log(num/power)		
		add = Math.floor(num/power);
		
		if (add>=1){
			base64 += base64Str.charAt(add);
			num -= add*power;
		}
	
		start -= 1;
	}
	return base64;
}
