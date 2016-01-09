var ngCore = require('angular2/core'),
    HexMapService = require('./hexMapService.js'),
    HexBoard = require('hex-grid-map/src/HexBoard.js');

//This directive creates a HexBoard for the decorated canvas element, and injects it back onto the service
module.exports = ngCore.Directive({
    selector: '[hexBoard]'
})
.Class({
  constructor: [ngCore.ElementRef, HexMapService, function(eleRef, hexMapService) {
          //Create the HexBoard with the canvas element, and inject it back onto the service
          hexMapService.setBoard(new HexBoard(eleRef.nativeElement));
          
          //small hack till I get around to fixing hex board directlly
          hexMapService.board.setContexts([]);
      }]
});
