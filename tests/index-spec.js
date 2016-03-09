var app = require('./../index');
var request = require('supertest');

describe('GET /user', function () {

    it("posts a new file to /file", function (done) {
        var json = {username: 'marcus', email: 'marcus@marcus.com'};

        request(app)
            .post("/json")
            .send(json)
            .expect(200)
            .expect(JSON.stringify(json), done);
    });
});