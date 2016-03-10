var Client = require('node-rest-client').Client,
    client = new Client,
    config = require('./config/service');

module.exports = function() {

    function connect(callback) {
        var args = { 
                data: config,
                headers: { "Content-Type": "application/json" }
            };
        console.log(' [s] Connecting to service discovery');
        client.put(
            "http://localhost:8500/v1/agent/service/register", 
            args, 
            function (data, response) {
                callback();
            }
        );
        console.log(' [s] Connected to service discovery');
    }

    function disconnect(callback) {
        console.log(' [s] Disconnecting from service discovery');
        client.get(
            "http://localhost:8500/v1/agent/service/deregister/datastore", 
            function (data, response) {
                callback();
            }
        );
        console.log(' [s] Disconnected from service discovery');
    }

    return {
        connect: connect,
        disconnect: disconnect
    };
}
