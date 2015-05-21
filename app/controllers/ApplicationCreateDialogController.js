/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

module.exports = ['$scope', '$http', '$mdDialog', 'ConfigService', function($scope, $http, $mdDialog, ConfigService) {
    $scope.application = {};
    $scope.errors = {};

    $scope.loading = false;

    /**
     * Create a new application using the current model
     */
    $scope.create = function() {
        $scope.loading = true;
        $scope.errors = {};

        $http.post(ConfigService.api + '/v1/applications', $scope.application, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function(result) {
                $mdDialog.hide();
            })
            .catch(function(err) {
                $scope.errors = err.data;
            })
            .finally(function() {
                $scope.loading = false
            });
    };

    /**
     * Cancel the creation of a new application
     */
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}];