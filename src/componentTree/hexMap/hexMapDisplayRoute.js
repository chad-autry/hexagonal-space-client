var ngCore = require('angular2/core'),
    ngBrowser = require('angular2/platform/browser'),
    HexMapService = require('./hexMapService.js');

//This is a component we can route to, which will then set the page title and set the variable to display our hidden map.
//Its done this way since we don't want to destroy/recreate the canvas element each time it is navigated away from
module.exports = ngCore
    .Component({
        selector: 'map',
        template: ``
     })
    .Class({
        constructor: [ngBrowser.Title, HexMapService, function(title, hexMapService) {
            //Save the titleService
            this.title = title;
            this.hexMapService = hexMapService;
        }],
        routerOnActivate: function(nextInstruction, prevInstruction) {
            this.title.setTitle("HS | Map");
            this.hexMapService.setShowMap(true);
        },
        routerOnDeactivate: function(nextInstruction, prevInstruction) {
            this.hexMapService.setShowMap(false);
        } 
    });
