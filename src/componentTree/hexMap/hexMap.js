var ngCore = require('angular2/core'),
    ngBrowser = require('angular2/platform/browser'),
    HexMapActivationService = require('./hexMapActivationService.js');

module.exports = ngCore
    .Component({
        selector: 'hex-map',
        template: `
<canvas hex-board resize hidpi="off" [style.display]="hexMapActivationService.showMap?'inherit':'none'" style="background-color: black; width:100%; height:100%; position: absolute; left: 0px;top: 0px; z-index: -1;">
`
     })
    .Class({
        constructor: [HexMapActivationService, function(hexMapActivationService) {
            this.hexMapActivationService = hexMapActivationService;
        }]
    });
