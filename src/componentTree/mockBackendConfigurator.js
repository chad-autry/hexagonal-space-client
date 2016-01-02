var ngCore = require('angular2/core'),
    ngHttp = require('angular2/http'),
    ngTesting = require('angular2/http/testing');


module.exports = ngCore
    .Class({
        constructor: [ngTesting.MockBackend, function( mockBackend) {
            mockBackend.connections.subscribe((c) => {
                c.mockRespond(new ngHttp.Response('fake response'));
            });
        }]
    });