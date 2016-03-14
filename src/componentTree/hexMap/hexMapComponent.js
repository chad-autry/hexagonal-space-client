var ngCore = require('angular2/core'),
    ngBrowser = require('angular2/platform/browser'),
    HexMapActivationService = require('./hexMapService.js'),
    HexMapService = require('./hexMapService.js'),
    HexBoardInjector = require('./HexBoardInjector.js');
    Popover = require('../../common/DynamicContentPopover.js');

module.exports = ngCore
    .Component({
        directives: [HexBoardInjector, Popover],
        selector: 'hex-map',
        template: `
<canvas hexBoard resize hidpi="off" [style.display]="hexMapService.showMap?'inherit':'none'" style="background-color: black; width:100%; height:100%; position: absolute; left: 0px;top: 0px; z-index: 200;"></canvas>
<popover></popover>
`
     })
    .Class({
        constructor: [[new ngCore.ViewChildren(Popover), ngCore.QueryList], HexMapService, function(popovers, hexMapService) {
            //Get the popover from our query when it is presented. This should be called once
            popovers.changes.subscribe((_) => {
                this.hexMapService.popover = popovers.first;
            });
            this.hexMapService = hexMapService;
        }]
    });
