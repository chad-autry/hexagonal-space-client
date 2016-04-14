"use strict";
//This JS file simply bootstraps the app from the root component when the window loads
var $ = require('jquery'); //Need jquery before GoldenLayout
var GoldenLayout = require('golden-layout');


(function() {
    document.addEventListener('DOMContentLoaded', function() {
       var config = {
           content: [{
               type: 'row',
               content:[{
                   type: 'component',
                   componentName: 'testComponent',
                   componentState: { label: 'A' }
               },{
                   type: 'column',
                   content:[{
                       type: 'component',
                       componentName: 'testComponent',
                       componentState: { label: 'B' }
                   },{
                       type: 'component',
                       componentName: 'testComponent',
                       componentState: { label: 'C' }
                   }]
               }]
           }]
        };
        var myLayout = new GoldenLayout( config );
        myLayout.registerComponent( 'testComponent', function( container, componentState ){
        container.getElement().html( '<h2>' + componentState.label + '</h2>' );
        });
        myLayout.init();
    });
})();