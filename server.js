var http = require('http'),
express = require("express"),
fs = require('fs'),
path = require('path'),
WEBROOT = path.join(path.dirname(__filename), '/webroot'),
redis = require("redis");

//Create express server
var server = express.createServer(),
server.use('/static',express.static(WEBROOT));

//Define route for the homepage
server.get('/', function (req, response) {
   fs.readFile(WEBROOT+'/index.html', function (err, data) {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.write(data);
        response.end();
    });
});

server.get('/add/:url', function (req, response) {
   //var num = get next number,
   //base64 = decToBase64(num);
   //add base64 as key to db, url is value
   //response.write(newurl);
   //response.end();
});

server.get('/:hex', function (req, response) {
   //var redirect = look up hex;
   //redirect user
   //ssendEmail
});

function decToBase64 (num){
	var start = Math.ceil(Math.log(num)/Math.log(64))
	base64Str = "abcdefghijklmnopqrstuvwyxABCDEFGHIJKLMNOPQRSTUVWYX0123456789",
	base64 = "",
	power = 0;
	console.log(start)
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