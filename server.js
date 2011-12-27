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
        var data = {
				"url":req.query['url'],
				"email": req.query['email'],
				"name": req.query['name'],
				"clicked": false,
				"wantsM": req.query['wants'],
				"m": "notSent",
				"messageBody": ""
			},
		base64 = gen64(6);
		
		if (data.url.substring(0, 'http://'.length) !== 'http://'){
			data.url='http://'+data.url;
		}
		redis.exists(base64, function(err, res){
			if (res == 0){
				redis.SET(
					base64,
					JSON.stringify(data),
					function(){
						response.write('{"url": "http://relert.herokuapp.com/'+base64+'"}');
						response.end();
				});
			}
		})
		
		
    });
});

app.get('/:hex', function (req, response) {
   if (req.params.hex){
	   redis.GET(req.params.hex, function(err, res){
				if (res) {
					data = JSON.parse(res);
					template(WEBROOT+"/frame.html.mu", {url:data.url, hex: req.params.hex}, function(a){
						sendEmail(req.params.hex, "email read1");
						setTimeout(function(){
							sendEmail(req.params.hex, "email read2");
						}, 1000*60*10); //try to send email in 10 minutes
						response.write(a);
						response.end();
					});
				}
		})
	}
});

app.post('/done/:hex', function (req, response) {
   if (req.params.hex){
		console.log(req.body);
		var data  = req.body;
		if (data.message=="true"){
			sendEmail(req.params.hex, data.messageBody, function(err){
					if (err){
							response.write('{"success": "false"}');
					} else {
						response.write('{"success": "true"}');
					}
					
					response.end();
			});
		}
	}
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

var sendEmail= function (hex, messageBody, callback){
	redis.GET(hex, function(err, res){
			if (res) {
				data = JSON.parse(res);
				
				if (data.m /*== "notSent"*/){
					data.m = "sent";
					data.messageBody = messageBody;
					redis.set(hex, JSON.stringify(data));
					
					template(WEBROOT+"/message.html.mu", {name: data.name, message: messageBody}, function (res){					
						ses.send({
						  from: 'kanter@mit.edu',
						  to: [data.email],
						  subject: "Relert for: " + data.name,
						  body: {
							  html: res
						  }
						});
						
						if (callback) {callback(false);}
					})
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

function gen64 (size){
	var base64Str = "abcdefghijklmnopqrstuvwyxzABCDEFGHIJKLMNOPQRSTUVWYXZ0123456789",
	len = base64Str.length,
	num = "";
	for (var i=0; i<size; i++){
		num+=base64Str.charAt(Math.floor(Math.random()*len));
	}
	return num;	
}
	
function template (file, data, callback){
	fs.readFile(file, function (err, res) {
		var template = hogan.compile(res.toString());
		var output = template.render(data);
        callback(output);
    });
}
