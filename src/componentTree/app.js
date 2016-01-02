var ngCore = require('angular2/core'),
    ngRouter = require('angular2/router'),
    navbarComponent = require('./navbar/navbar.js'),
    scenariosComponent = require('./scenarios/scenarios.js'),
    userManagementComponent = require('./userManagement/userManagement.js'),
    hexMapComponent = require('./hexMap/hexMap.js'),
    hexMapActivatorComponent = require('./hexMap/hexMapActivator.js'),
    HexMapActivationService = require('./hexMap/hexMapActivationService.js'),
    loginComponent = require('../common/Login.js');

module.exports = ngCore
    .Component({
        selector: 'my-app',
        directives: [navbarComponent, hexMapComponent, ngRouter.ROUTER_DIRECTIVES],
        providers: [ngCore.provide(HexMapActivationService, {useClass:HexMapActivationService})],
        template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <!--The hex-map element has to statically be present, since we don't want to destroy and recreate the backing canvas element -->
    <hex-map></hex-map>`
     })
    .Class({
        constructor: [ngRouter.Router, function( router) {
            //Configure our routes
            router.config([
                { path: '/scenarios', component: scenariosComponent, name: 'Scenarios', useAsDefault: true },
                { path: '/map', component: hexMapActivatorComponent, name: 'Map'},
                { path: '/login', component: loginComponent, name: 'Login'},
                { path: '/user', component: userManagementComponent, name: 'UserManagement'}
            ]);
        }]
    });