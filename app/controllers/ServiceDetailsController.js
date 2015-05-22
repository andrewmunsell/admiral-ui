/**
 * @package admiral
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

var moment = require('moment');

module.exports = ['$scope', '$routeParams', '$location', '$http', 'ConfigService', function($scope, $routeParams, $location, $http, ConfigService) {
    $scope.id = $routeParams.serviceId;
    $scope.service = null;
    $scope.application = null;

    $scope.loading = false;

    /**
     * Start the service
     */
    $scope.start = function() {
        $scope.changeState('starting');
    };

    /**
     * Stop the service
     */
    $scope.stop = function() {
        $scope.changeState('stopping');
    };

    /**
     * Unload the service
     */
    $scope.unload = function() {
        $scope.changeState('unloading');
    };

    /**
     * Change the service to the specified state
     */
    $scope.changeState = function(state) {
        $scope.loading = true;

        $http({
            method: 'PUT',
            url: ConfigService.api + '/v1/services/' + $scope.id + '/state',

            data: JSON.stringify({
                state: state
            }),

            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function() {
                $scope.load(false);
            })
            .finally(function() {
                $scope.loading = false;
            });
    };

    /**
     * Terminate and delete the service
     */
    $scope.terminate = function() {
        $scope.loading = true;

        $http({
            method: 'DELETE',
            url: ConfigService.api + '/v1/services/' + $scope.id,

            data: '',

            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function() {
                $location.path('applications/' + $scope.application.id);
            })
            .finally(function() {
                $scope.loading = false;
            });
    };

    /**
     * Load the service
     */
    $scope.load = function(cache) {
        $scope.loading = true;

        $http({
            method: 'GET',
            url: ConfigService.api + '/v1/services/' + $scope.id + (cache === false ? '?' + moment().unix() : ''),
            data: '',
            cache: !!cache,

            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function(result) {
                $scope.service = result.data;

                // Post-process the data
                $scope.service.createdAtRelative = moment($scope.service.createdAt).fromNow();
            })
            .then(function() {
                return $http({
                    method: 'GET',
                    url: ConfigService.api + '/v1/applications/' + $scope.service.application,
                    data: '',

                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            })
            .then(function(result) {
                $scope.application = result.data;
            })
            .finally(function() {
                $scope.loading = false;
            });
    };

    // Initialize
    $scope.load();
}];