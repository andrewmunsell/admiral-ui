/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

module.exports = ['$scope', '$http', '$mdDialog', 'ConfigService', function($scope, $http, $mdDialog, ConfigService) {
    $scope.loading = false;

    /**
     * Create or edit a new frontend using the current model
     */
    $scope.save = function() {
        $scope.loading = true;
        $scope.errors = {};

        if($scope.frontend.id) {
            var url = ConfigService.api + '/v1/router/frontends/' + $scope.frontend.id;
        } else {
            var url = ConfigService.api + '/v1/router/frontends';
        }

        $http.post(url, $scope.frontend, {
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
                $scope.loading = false;
            });
    };

    /**
     * Delete the current frontend
     */
    $scope.delete = function() {
        $scope.loading = true;

        var url = ConfigService.api + '/v1/router/frontends/' + $scope.frontend.id;

        $http.delete(url, $scope.frontend, {
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
                $scope.loading = false;
            });
    };

    /**
     * Cancel the creation of a new application
     */
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}];