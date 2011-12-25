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
	redis.set('count', '10000000');
} else {
	//var redis = redislib.createClient();
}

//Create express server
var app = express.createServer(express.logger());
app.use('/static',express.static(WEBROOT));

//Define route for the homepage
app.get('/', function (req, response) {
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
				response.contentType('application/json')
				response.write('{"url": http://relert.herokuapp.com/go/'+base64+'}');
				response.end();
		});
    });
});

app.get('/go/:hex', function (req, response) {
   if (req.params.hex){
	   redis.get(req.params.hex, function(err, res){
				if (res) {
					//response.redirect(res.url)
					//response.write(res.url.toString());
					response.end();
				}
		})
	}
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
