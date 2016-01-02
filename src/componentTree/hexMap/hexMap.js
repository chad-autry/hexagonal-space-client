var ngCore = require('angular2/core'),
    ngBrowser = require('angular2/platform/browser');

module.exports = ngCore
    .Component({
        selector: 'map',
        template: `
<canvas hex-board resize hidpi="off" style="background-color: black; width:100%; height:100%; position: absolute; left: 0px;top: 0px; z-index: -1;">
`
     })
    .Class({
        constructor: [ngBrowser.Title, function( title) {
            //Save the titleService
            this.title = title;
        }],
        routerOnActivate: function(nextInstruction, prevInstruction) {
            this.title.setTitle("HS | Map");
        }
    });
