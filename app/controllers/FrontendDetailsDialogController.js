/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

module.exports = ['$scope', '$http', '$mdDialog', 'ConfigService', function($scope, $http, $mdDialog, ConfigService) {
    $scope.unitFiles = [];
    $scope.loading = false;

    /**
     * Load the services that have routing enabled
     */
    $scope.loadServices = function() {
        $http({
            method: 'GET',
            url: ConfigService.api + '/v1/services',
            headers: {
                'Content-Type': 'application/json'
            },

            data: ''
        })
            .then(function(results) {
                var unitFiles = [];

                for(var i = 0; i < results.data.length; i++) {
                    var u = results.data[i].unitFiles;

                    for(var n = 0; n < u.length; n++) {
                        //if(u[n].port) {
                            var unit = u[n];
                            unit.serviceName = results.data[i].name;

                            unitFiles.push(unit);
                        //}
                    }
                }

                console.log(unitFiles);

                $scope.unitFiles = unitFiles;
            });
    };

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
     * Cancel the creation of a new application
     */
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}];