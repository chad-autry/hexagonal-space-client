var ngCore = require('angular2/core'),
    ngBrowser = require('angular2/platform/browser'),
    HexMapActivationService = require('./hexMapActivationService.js');

module.exports = ngCore
    .Component({
        selector: 'map',
        template: ``
     })
    .Class({
        constructor: [ngBrowser.Title, HexMapActivationService, function(title, hexMapActivationService) {
            //Save the titleService
            this.title = title;
            this.hexMapActivationService = hexMapActivationService;
        }],
        routerOnActivate: function(nextInstruction, prevInstruction) {
            this.title.setTitle("HS | Map");
            this.hexMapActivationService.setShowMap(true);
        },
        routerOnDeactivate: function(nextInstruction, prevInstruction) {
            this.hexMapActivationService.setShowMap(false);
        } 
    });
