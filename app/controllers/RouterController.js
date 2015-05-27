/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

var moment = require('moment');

module.exports = ['$scope', '$http', '$mdDialog', 'ConfigService', function($scope, $http, $mdDialog, ConfigService) {
    $scope.frontends = [];
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