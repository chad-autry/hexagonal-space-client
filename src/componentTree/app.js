var ngCore = require('angular2/core'),
    ngRouter = require('angular2/router'),
    navbarComponent = require('./navbar/navbar.js'),
    scenariosComponent = require('./scenarios/scenarios.js'),
    userManagementComponent = require('./userManagement/userManagement.js'),
    hexMapComponent = require('./hexMap/hexMapComponent.js'),
    hexMapDisplayRoute = require('./hexMap/hexMapDisplayRoute.js'),
    HexMapService = require('./hexMap/hexMapService.js'),
    loginComponent = require('../common/Login.js');

module.exports = ngCore
    .Component({
        selector: 'my-app',
        directives: [navbarComponent, hexMapComponent, ngRouter.ROUTER_DIRECTIVES],
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
                { path: '/map', component: hexMapDisplayRoute, name: 'Map'},
                { path: '/login', component: loginComponent, name: 'Login'},
                { path: '/user', component: userManagementComponent, name: 'UserManagement'}
            ]);
        }]
    });