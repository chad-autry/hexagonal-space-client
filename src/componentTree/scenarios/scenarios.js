var ngCore = require('angular2/core'),
    ngBrowser = require('angular2/platform/browser'),
    ScenarioService = require('../../services/ScenarioService');

module.exports = ngCore
    .Component({
        selector: 'app-home',
        template: `
<div class="container">
<div class="container-fluid">
    
    <div class="row">
        <!-- Columns start at 50% wide on mobile and bump down to 50% wide on desktop -->
        <div class="col-xs-12 col-md-6"  *ngFor="#scenario of scenarioService.getScenarios()">
            <div class="panel panel-default" (click)='scenarioService.activateScenario(scenario)'>
                <div class="panel-heading">
                    <!--Note: Floating elements using pull-right need to come before non-floating elements in order to be vertically centered properly-->
                    <span class="pull-right label label-success" *ngIf='scenarioService.isActive(scenario)'>Active</span>
                    <h3 class="panel-title">{{scenario.title}}</h3>

                </div>
                <div class="panel-body">
                    <p>{{scenario.description}}</p>
                </div>
            </div>
        </div>
    </div>
</div>
</div>`
     })
    .Class({
        constructor: [ngBrowser.Title, ScenarioService, function( title, scenarioService) {
            //Save the titleService
            this.title = title;
            this.scenarioService = scenarioService;
        }],
        routerOnActivate: function(nextInstruction, prevInstruction) {
            this.title.setTitle("HS | Scenarios");
            this.scenarioService.loadScenarios();
        }
    });