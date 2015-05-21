/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

module.exports = ['$scope', '$location', '$q', '$http', '$mdDialog', '$mdToast', 'ConfigService', function($scope, $location, $q, $http, $mdDialog, $mdToast, ConfigService) {
    $scope.applications = [];
    $scope.selectedApplications = [];

    $scope.loading = false;

    /**
     * Toggle selection
     * @param id
     */
    $scope.toggleSelection = function(id) {
        if($scope.isApplicationSelected(id)) {
            $scope.selectedApplications.splice($scope.selectedApplications.indexOf(id), 1);
        } else {
            $scope.selectedApplications.push(id);
        }
    };

    /**
     * Determines whether the specified application is selected
     * @param id
     */
    $scope.isApplicationSelected = function(id) {
        return $scope.selectedApplications.indexOf(id) > -1;
    };

    /**
     * Destroy the selected applications
     */
    $scope.destroySelected = function() {
        var applicationsToDestroy = [];
        for(var i = 0; i < $scope.applications.length; i++) {
            if($scope.isApplicationSelected($scope.applications[i].id)) {
                applicationsToDestroy.push($scope.applications[i]);
            }
        }

        // Prompt the user to ensure they want to destroy the applications
        var dialog = $mdDialog.confirm()
            .content('Are you sure you want to destroy the following applications?: ' +
                applicationsToDestroy.map(function(app) {
                    return app.name;
                }).join(', '))
            .theme('admiral')
            .ok('Yes')
            .cancel('Cancel');

        $mdDialog.show(dialog)
            .then(function() {
                $scope.loading = true;

                return $q.all(applicationsToDestroy.map(function(application) {
                    return $http.delete(ConfigService.api + '/v1/applications/' + application.id);
                }));
            })
            .then(function() {
                var toast = $mdToast
                    .simple()
                    .content('The specified applications were destroyed.')
                    .position('top right')
                    .theme('admiral');

                $mdToast.show(toast);

                $scope.load(false);
            })
            .catch(function() {
                var toast = $mdToast
                    .simple()
                    .content('There was a problem destroying the specified applications.')
                    .position('top right')
                    .action('Ok')
                    .hideDelay(false)
                    .theme('admiral');

                $mdToast.show(toast);
            })
            .finally(function() {
                $scope.selectedApplications = [];

                $scope.loading = false;
            });
    };

    /**
     * Show the application creation dialog
     */
    $scope.createApplication = function() {
        $mdDialog.show({
            controller: require('./ApplicationCreateDialogController'),
            templateUrl: 'app/views/application-create-dialog.html',
            theme: 'admiral'
        })
            .then(function() {
                var toast = $mdToast
                    .simple()
                    .content('Your application was created.')
                    .position('top right')
                    .theme('admiral');

                $mdToast.show(toast);

                $scope.load(false);
            });
    };

    /**
     * Open the details page for the specified application
     * @param id
     */
    $scope.openApplication = function(id) {
        $location.path('/applications/' + id);
    };

    /**
     * Load the applications
     */
    $scope.load = function(cache) {
        $scope.loading = true;

        var options = {};

        if(cache === false) {
            options.cache = false;
            options.params = {
                'cache-bust': new Date().getTime()
            };
        }

        $http.get(ConfigService.api + '/v1/applications', options)
            .then(function(result) {
                $scope.applications = result.data;
            })
            .finally(function() {
                $scope.loading = false;
            });
    };

    // Initialize
    $scope.load();
}];