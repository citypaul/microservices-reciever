var Client = require('node-rest-client').Client;
var serviceConfig = require('./config/service');

module.exports = function () {

    function broadcast() {
        var client = new Client();
        var args = {
            data: serviceConfig,
            headers: { "Content-Type": "application/json" }
        };

        client.put("http://172.29.66.157:8500/v1/agent/service/register", args, function (data, response) {
            console.log(data);
            console.log(response);
        });
    }

    return {
        broadcast: broadcast
    }
}