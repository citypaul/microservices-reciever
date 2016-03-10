var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var dataStore = [];
var Client = require('node-rest-client').Client;
var id = 0;
var amqp = require('amqplib/callback_api');

replayEvents(getEvents());

function getEvents() {
	return JSON.parse(fs.readFileSync('event-store.json', 'utf-8'));
}

function replayEvents(events) {
	events.forEach(function(event) {
		id = event.id > id ? event.id : id;
		console.log(' [x] Replaying %s', JSON.stringify(event));
		pushToConsumer(event);
	});
}

function storeEvent(event) {
	var events = getEvents().concat([event]);
	fs.writeFileSync('event-store.json', JSON.stringify(events), 'utf-8');
	dataStore.push(event)
}

function pushToConsumer(data) {
	amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var q = 'fileQueue';
            ch.assertQueue(q, {durable: false});
            ch.sendToQueue(q, new Buffer(JSON.stringify(data)));
            console.log(" [x] Sent Data");
        });
    });
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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

			storeEvent(data);
			pushToConsumer(data);

  			console.log(" [x] Received %s", JSON.stringify(payload));
		}, {noAck: true});
  	});
});

module.exports = app;
