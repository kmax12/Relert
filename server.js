var http = require('http'),
express = require("express"),
fs = require('fs'),
url = require('url'),
util = require('util'),
path = require('path'),
WEBROOT = path.join(path.dirname(__filename), '/webroot'),
redislib = require('redis'),
nodemailer = require('nodemailer'),
hogan = require('hogan.js');


nodemailer.SES = {
    AWSAccessKeyID: '', // required
    AWSSecretKey: '', // required
    ServiceUrl: 'email-smtp.us-east-1.amazonaws.com', // optional
}

var AmazonSES = require('amazon-ses');
var ses = new AmazonSES('AKIAJEV7F3VKBWCX7XGA', 'ANMZibtTjrbaTVvd/uflkdMOGCuwn1lRXOQ4xb80');

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
app.use(express.bodyParser());

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
        var base64 = decToBase64(res),
        data = {
				"url":req.query['url'],
				"email": req.query['email'],
				"name": req.query['name'],
				"clicked": false,
				"wantsM": req.query['wants'],
				"m": "notSent"
			};
		
		redis.SET(
			base64,
			JSON.stringify(data),
			function(){
				response.write('{"url": "http://relert.herokuapp.com/'+base64+'"}');
				response.end();
		});
    });
});

app.get('/:hex', function (req, response) {
   if (req.params.hex){
	   redis.GET(req.params.hex, function(err, res){
				if (res) {
					data = JSON.parse(res);
					template(WEBROOT+"/frame.html.mu", {title:data.url}, function(a){
						setTimeout(1000*60*10, function(){sendEmail(req.params.hex)}); //try to send email in 10 minutes
						response.write(a);
						response.end();
					});
					
				}
		})
	}
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

var sendEmail= function (relertId){
	redis.GET(relertId, function(err, res){
			if (res) {
				data = JSON.parse(res);
				
				if (data.m == "notSent"){
					data.m = "sent";
					redis.set(relertId, JSON.stringify(data));
					console.log(data.email);
					ses.send({
					  from: 'kanter@mit.edu',
					  to: [data.email],
					  subject: "Relert for: " + data.name,
					  body: {
						  text: 'This is a relert for' + data.name,
						  html: 'This is a relert for' + data.name
					  }
					});
				}
				
			}
	})
	
}

function decToBase64 (num){
	var start = Math.ceil(Math.log(num)/Math.log(64)) +1,
	base64Str = "abcdefghijklmnopqrstuvwyxABCDEFGHIJKLMNOPQRSTUVWYX0123456789",
	base64 = "",
	power = 0;
	//console.log(start)
	while (start+1){
		power = Math.pow(62,start);
		//console.log(power);
		//console.log(num/power)		
		add = Math.floor(num/power);
		
		if (add>=1){
			base64 += base64Str.charAt(add);
			num -= add*power;
		}
	
		start -= 1;
	}
	return base64;
}
	
function template (file, data, callback){
	fs.readFile(file, function (err, res) {
		var template = hogan.compile(res.toString());
		var output = template.render(data);
        callback(output);
    });
}
