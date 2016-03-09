var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var dataStore = [];
var Client = require('node-rest-client').Client;
var id = 0;

function pushToConsumer(data) {
	var client = new Client();

	var args = {
		data: data,
		headers: { "Content-Type": "application/json" }
	};
 
	client.post("http://localhost:3000/file", args, function (data, response) {
		console.log(data);
		console.log(response);
	});
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/json', function(req, res) {
	var data = {
		timestamp: Date.now(),
		id: id +=1
		content: req.body
	};
	dataStore.push(data);
	console.log(dataStore);
	pushToConsumer(data);

	res.status(200).json(req.body);
});

module.exports = app;
