var app = require('./../index');
var request = require('supertest');
var expect = require('chai').expect;

describe('GET /user', function () {

    it("posts a new file to /file", function (done) {
        var json = {username: 'marcus', email: 'marcus@marcus.com'};

        request(app)
            .post("/json")
            .send(json)
            .expect(200)
            .end(function (err, res) {
                expect(JSON.parse(res.text)).to.eql(json);
                done();
            });
    });
});