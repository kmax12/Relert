var http = require('http'),
express = require("express"),
fs = require('fs'),
url = require('url'),
util = require('util'),
path = require('path'),
WEBROOT = path.join(path.dirname(__filename), '/webroot'),
redislib = require('redis'),
nodemailer = require('nodemailer');

nodemailer.SES = {
    AWSAccessKeyID: '', // required
    AWSSecretKey: '', // required
    ServiceUrl: 'email-smtp.us-east-1.amazonaws.com', // optional
}

var AmazonSES = require('amazon-ses');
var ses = new AmazonSES('kanter@mit.edu', 'shelly12');
 ses.listVerifiedEmailAddresses(function(result) {
    console.log(result);
  });

ses.send({
      from: 'kanter@mit.edu',
      to: ['kanter@mit.edu', 'kanter@mit.edu'],
      subject: 'Test subject',
      body: {
          text: 'This is the text of the message.',
          html: 'This is the html body of the message.'
      }
  });

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
        var base64 = decToBase64(res),
        data = {
				"url":req.query['url'],
				"email": req.query['email'],
				"name": req.query['name']
			};
		
		redis.SET(
			base64,
			JSON.stringify(data),
			function(){
				response.write('{"url": "http://relert.herokuapp.com/go/'+base64+'"}');
				response.end();
		});
    });
});

app.get('/go/:hex', function (req, response) {
   if (req.params.hex){
	   redis.GET(req.params.hex, function(err, res){
				if (res) {
					data = JSON.parse(res);
					console.log(data.url);
					response.redirect(data.url)
					//response.write(res.url);
					//response.end();
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
