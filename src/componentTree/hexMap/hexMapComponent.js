var ngCore = require('angular2/core'),
    ngBrowser = require('angular2/platform/browser'),
    HexMapActivationService = require('./hexMapService.js'),
    HexMapService = require('./hexMapService.js'),
    HexBoardInjector = require('./HexBoardInjector.js');

module.exports = ngCore
    .Component({
        directives: [HexBoardInjector],
        selector: 'hex-map',
        template: `
<canvas hexBoard resize hidpi="off" [style.display]="hexMapService.showMap?'inherit':'none'" style="background-color: black; width:100%; height:100%; position: absolute; left: 0px;top: 0px; z-index: 200;"></canvas>
`
     })
    .Class({
        constructor: [HexMapService, function(hexMapService) {
            this.hexMapService = hexMapService;
        }]
    });
