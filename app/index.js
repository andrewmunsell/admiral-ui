/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

var angular = require('angular');

angular.module('AdmiralApp', [ require('angular-route'), require('angular-material') ])
    .config(require('./theme'))
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/index.html',
                controller: require('./controllers/IndexController'),
                title: ['Dashboard']
            })
            .when('/applications', {
                templateUrl: 'app/views/applications.html',
                controller: require('./controllers/ApplicationsController'),
                title: ['Applications']
            })
            .when('/applications/:applicationId', {
                templateUrl: 'app/views/application-details.html',
                controller: require('./controllers/ApplicationDetailsController'),
                title: ['Applications', 'Details']
            })
            .when('/applications/:applicationId/services/new', {
                templateUrl: 'app/views/service-create.html',
                controller: require('./controllers/ServiceCreateController'),
                title: ['Applications', 'Services', 'New Service']
            })
            .when('/applications/:applicationId/services/:serviceId', {
                templateUrl: 'app/views/service-details.html',
                controller: require('./controllers/ServiceDetailsController'),
                title: ['Applications', 'Services', 'Details']
            })
            .when('/services', {
                templateUrl: 'app/views/services.html',
                controller: require('./controllers/ServicesController'),
                title: ['Services']
            })
            .when('/machines', {
                templateUrl: 'app/views/machines.html',
                controller: require('./controllers/MachinesController'),
                title: ['Machines']
            });
    }])
    .factory('ConfigService', function() {
        return {
            api: ''
        };
    })
    .controller('AppController', require('./controllers/AppController'))

    // Register controllers for the service creation steps
    .controller('FinishController', require('./controllers/service-create/FinishController'))

    .controller('FleetUnitsUnitFilesController', require('./controllers/service-create/FleetUnitsUnitFilesController'))
    .controller('FleetUnitsSettingsController', require('./controllers/service-create/FleetUnitsSettingsController'));