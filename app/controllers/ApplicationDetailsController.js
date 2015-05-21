/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

var moment = require('moment');

module.exports = ['$scope', '$routeParams', '$location', '$http', '$mdDialog', '$mdToast', 'ConfigService', function($scope, $routeParams, $location, $http, $mdDialog, $mdToast, ConfigService) {
    $scope.id = $routeParams.applicationId;
    $scope.application = null;
    $scope.loading = false;

    /**
     * Create a new service
     */
    $scope.createService = function() {
        $location.path('applications/' + $scope.id + '/services/new');
    };

    /**
     * Open the details page for the specified service
     * @param id
     */
    $scope.openService = function(id) {
        $location.path('applications/' + $scope.id + '/services/' + id);
    };

    /**
     * Load the data for the current application.
     */
    $scope.load = function() {
        $scope.loading = true;

        $http.get(ConfigService.api + '/v1/applications/' + $scope.id)
            .then(function(result) {
                $scope.application = result.data;

                // Post-process the data
                var services = $scope.application.services;
                if(services.length == 0) {
                    $scope.application.status = 'Idle';
                } else {
                    var runningServices = services.filter(function(service) {
                        return service.state == 'running';
                    });

                    if(runningServices.length == services.length) {
                        $scope.application.status = 'Running';
                    } else {
                        $scope.application.status = 'Partially Running';
                    }
                }

                $scope.application.createdAtRelative = moment($scope.application.createdAt).fromNow();
            })
            .finally(function() {
                $scope.loading = false;
            });
    };

    // Initialize
    $scope.load();
}];