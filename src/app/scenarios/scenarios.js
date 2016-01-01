var ngCore = require('angular2/core'),
    ngBrowser = require('angular2/platform/browser');

module.exports = ngCore
    .Component({
        selector: 'app-home',
        template: `
<div class="container">

</div>`
     })
    .Class({
        constructor: [ngBrowser.Title, function( title) {
            //Save the titleService
            this.title = title;
        }],
        routerOnActivate: function(nextInstruction, prevInstruction) {
            this.title.setTitle("HS | Scenarios");
        }
    });
