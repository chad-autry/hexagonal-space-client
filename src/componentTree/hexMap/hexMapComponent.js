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
<div class="popover top" [style.display]="hexMapService.showMap?'inherit':'none'" style="position: absolute; left: 100px;top: 100px; z-index: 250;"><div class="arrow"></div><h3 class="popover-title">Title</h3><div class="popover-content">Test</div>
`
     })
    .Class({
        constructor: [HexMapService, function(hexMapService) {
            this.hexMapService = hexMapService;
        }]
    });
