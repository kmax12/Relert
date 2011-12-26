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
    AWSAccessKeyID: 'AKIAJ6PO3P4KGEAOX3IA', // required
    AWSSecretKey: 'AvOo1V7xZzHkT5KAyqf7H0Te9HKEqmTcf8fbmp1iHXeW', // required
    ServiceUrl: 'email-smtp.us-east-1.amazonaws.com', // optional
}


nodemailer.send_mail(
    // e-mail options
    {
        sender: 'kanter@mit.edu',
        to:'kanter@mit.edu',
        subject:'Hello!',
        html: '<p><b>Hi,</b> how are you doing?</p>',
        body:'Hi, how are you doing?'
    },
    // callback function
    function(error, success){
        console.log('Message ' + success ? 'sent' : 'failed');
    }
);

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
				"email": req.query['email']
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
