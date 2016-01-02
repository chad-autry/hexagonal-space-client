var ngCore = require('angular2/core'),
    ngRouter = require('angular2/router'),
    navbarComponent = require('./navbar/navbar.js'),
    scenariosComponent = require('./scenarios/scenarios.js'),
    userManagementComponent = require('./userManagement/userManagement.js'),
    hexMapComponent = require('./hexMap/hexMap.js'),
    loginComponent = require('../common/Login.js');

module.exports = ngCore
    .Component({
        selector: 'my-app',
        directives: [navbarComponent, ngRouter.ROUTER_DIRECTIVES],
        template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>`
     })
    .Class({
        constructor: [ngRouter.Router, function( router) {
            //Configure our routes
            router.config([
                { path: '/scenarios', component: scenariosComponent, name: 'Scenarios', useAsDefault: true },
                { path: '/map', component: hexMapComponent, name: 'Map'},
                { path: '/login', component: loginComponent, name: 'Login'},
                { path: '/user', component: userManagementComponent, name: 'UserManagement'}
            ]);
        }]
    });