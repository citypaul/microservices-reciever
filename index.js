var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var dataStore = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/json', function(req, res) {
	var file = req.body;
	dataStore.push(file);
	res.status(200).json(file);
});

module.exports = app;
