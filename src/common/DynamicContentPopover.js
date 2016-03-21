var ngCore = require('angular2/core'),
    ngRouter = require('angular2/router');

// A custom directive to apply the given class
// to elements with a child routerLink directive that's active
module.exports = ngCore.Component({
    selector: 'popover',
    template: `<div class="popover top" [style.display]="(showPopover)?'inherit':'none'" [style.left]="popoverX +'px'" [style.top]="popoverY +'px'" style="position: absolute; z-index: 250; transform: translate(-50%, -100%)"><div class="arrow"></div><h3 class="popover-title">{{popoverTitle}}</h3><div class="popover-content" #contentComponent></div>`
})
.Class({
  constructor: [ngCore.ElementRef, ngCore.DynamicComponentLoader,
      function(eleRef, dynamicComponentLoader) {
          this.eleRef = eleRef;
          this.dynamicComponentLoader = dynamicComponentLoader;
          this.popoverTitle= 'Test';
          this.popverX= 0;
          this.popoverY= 0;
          this.showPopover= true;
      }],
  setContentComponent: function(component) {
      if (!!this.componentRef) {
          this.componentRefdispose();
      }
      this.dynamicComponentLoader.loadIntoLocation(component, this.eleRef, 'contentComponent').then(componentRef => this.componentRef = componentRef);
  }
});