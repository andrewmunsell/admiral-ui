/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

var moment = require('moment');

module.exports = ['$scope', '$http', '$mdDialog', 'ConfigService', function($scope, $http, $mdDialog, ConfigService) {
    $scope.frontends = [];
    $scope.unitFiles = [];

    $scope.loading = false;

    /**
     * Load the frontends
     */
    $scope.load = function(cache) {
        $scope.loading = true;

        $http.get(ConfigService.api + '/v1/router/frontends' + (cache === false ? '?' + moment().unix() : ''))
            .then(function(result) {
                $scope.loading = false;
                $scope.frontends = result.data;
            });

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
                        if(u[n].port) {
                            var unit = u[n];
                            unit.serviceName = results.data[i].name;

                            unitFiles.push(unit);
                        }
                    }
                }

                $scope.unitFiles = unitFiles;
            });
};

    /**
     * View and edit the frontend information
     */
    $scope.viewFrontend = function(frontendId) {
        var frontend = $scope.frontends.filter(function(frontend) {
            return frontend.id == frontendId;
        })[0];

        $scope.showFrontendDialog(frontend);
    };

    /**
     * Create a new frontend
     */
    $scope.createFrontend = function() {
        $scope.showFrontendDialog({});
    };

    /**
     * Show the frontend dialog
     * @param frontend
     */
    $scope.showFrontendDialog = function(frontend) {
        var childScope = $scope.$new(true);
        childScope.frontend = frontend;
        childScope.unitFiles = $scope.unitFiles;

        $mdDialog.show({
            controller: require('./FrontendDetailsDialogController'),
            templateUrl: 'app/views/frontend-details-dialog.html',
            theme: 'admiral',
            scope: childScope
        })
            .then(function() {
                $scope.load(false);
            });
    };

    // Initialize
    $scope.load();
}];