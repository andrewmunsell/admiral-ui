/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

module.exports = ['$scope', '$http', 'ConfigService', function($scope, $http, ConfigService) {
    $scope.machines = 0;
    $scope.applications = 0;
    $scope.loading = 0;

    /**
     * Load the data in the dashboard
     */
    $scope.load = function() {
        $scope.loading += 3;

        $http.get(ConfigService.api + '/v1/machines')
            .then(function(result) {
                $scope.machines = result.data.length;
                $scope.loading--;
            });

        $http.get(ConfigService.api + '/v1/applications')
            .then(function(result) {
                $scope.applications = result.data.length;
                $scope.loading--;
            });

        $http.get(ConfigService.api + '/v1/services')
            .then(function(result) {
                $scope.services = result.data.filter(function(service) {
                    return service.state == 'running';
                }).length;

                $scope.loading--;
            });
    };

    // Initialize
    $scope.load();
}];