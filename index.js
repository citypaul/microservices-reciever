var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var dataStore = [];
var Client = require('node-rest-client').Client;
var id = 0;
var amqp = require('amqplib/callback_api');

function pushToConsumer(data) {
	var client = new Client();

	var args = {
		data: data,
		headers: { "Content-Type": "application/json" }
	};
 
	client.post("http://localhost:3000/file", args, function (data, response) {
		console.log("Done");
	});
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// app.post('/json', function(req, res) {
// 	var data = {
// 		timestamp: Date.now(),
// 		id: id +=1,
// 		content: req.body
// 	};
// 	dataStore.push(data);
// 	console.log(dataStore);
// 	pushToConsumer(data);

// 	res.status(200).json(req.body);
// });

amqp.connect('amqp://localhost', function(err, conn) {
  	conn.createChannel(function(err, ch) {
    	var q = 'queue';

    	ch.assertQueue(q, {durable: false});
    	console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
		ch.consume(q, function(message) {
			var payload = JSON.parse(message.content.toString());
			var data = {
				timestamp: Date.now(),
				id: id +=1,
				content: payload
			};

			dataStore.push(data)
			pushToConsumer(data);

  			console.log(" [x] Received %s", JSON.stringify(payload));
		}, {noAck: true});
  	});
});



module.exports = app;
