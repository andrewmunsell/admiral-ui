/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

module.exports = ['$scope', '$http', '$location', '$routeParams', 'ConfigService', function($scope, $http, $location, $routeParams, ConfigService) {
    var applicationId = $routeParams.applicationId;

    /**
     * Create the service
     */
    $scope.create = function(redirect) {
        $scope.$parent.$parent.loading = true;

        return $http({
            method: 'POST',
            url: ConfigService.api + '/v1/applications/' + applicationId + '/services',
            data: JSON.stringify($scope.$parent.$parent.service),

            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function(result) {
                return result.data;
            })
            .then(function(service) {
                if(redirect === true) {
                    $location.path('services/' + service.id);
                }

                return service;
            })
            .finally(function() {
                $scope.$parent.$parent.loading = false;
            });
    };

    /**
     * Create the service and then launch it.
     */
    $scope.createAndLaunch = function() {
        $scope.create(false)
            .then(function(service) {
                $scope.$parent.$parent.loading = true;

                return $http({
                    method: 'PUT',
                    url: ConfigService.api + '/v1/services/' + service.id + '/state',
                    data: JSON.stringify({
                        state: 'starting'
                    }),

                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            })
            .then(function(result) {
                return result.data;
            })
            .then(function(deployment) {
                $location.path('applications/' + applicationId + '/services/' + deployment.service);
            })
            .finally(function() {
                $scope.$parent.$parent.loading = false;
            });
    };
}];