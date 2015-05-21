/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

module.exports = ['$scope', '$http', '$location', '$routeParams', '$mdDialog', '$mdToast', 'ConfigService', function($scope, $http, $location, $routeParams, $mdDialog, $mdToast, ConfigService) {
    $scope.applicationId = $routeParams.applicationId;
    $scope.selectedServices = [];

    $scope.loading = false;

    /**
     * Toggle selection
     * @param id
     */
    $scope.toggleSelection = function(id) {
        if($scope.isServiceSelected(id)) {
            $scope.selectedServices.splice($scope.selectedServices.indexOf(id), 1);
        } else {
            $scope.selectedServices.push(id);
        }
    };

    /**
     * Determines whether the specified service is selected
     * @param id
     */
    $scope.isServiceSelected = function(id) {
        return $scope.selectedServices.indexOf(id) > -1;
    };

    /**
     * Create a new service for the specified application
     * @param application
     */
    $scope.createService = function(application) {
        $location.path('applications/' + application + '/services/new');
    };

    /**
     * Open the specified service for the specified application.
     * @param application
     * @param service
     */
    $scope.openService = function(application, service) {
        $location.path('applications/' + application + '/services/' + service);
    }

    /**
     * Start the currently selected services
     */
    $scope.startSelected = function() {
        $scope.changeSelectedState('starting', 'start', 'starting');
    };

    /**
     * Stop the currently selected services
     */
    $scope.stopSelected = function() {
        $scope.changeSelectedState('stopping', 'stop', 'stopping');
    };

    /**
     * Terminate the currently selected services
     */
    $scope.terminateSelected = function() {
        var loading = $scope.selectedServices.length;
        $scope.loading = true;

        var failed = [];

        for(var i = 0; i < $scope.selectedServices.length; i++) {
            (function(service) {
                $http({
                    method: 'DELETE',
                    url: ConfigService.api + '/v1/services/' + service,
                    data: '',

                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .catch(function(err) {
                        failed.push(service);
                    })
                    .finally(function() {
                        loading--;

                        if(loading == 0) {
                            $scope.loading = false;

                            var toast;
                            if(failed.length) {
                                toast = $mdToast
                                    .simple()
                                    .content(failed.length + ' services failed to terminate.')
                                    .position('top right')
                                    .action('Ok')
                                    .hideDelay(false)
                                    .theme('admiral');
                            } else {
                                toast = $mdToast
                                    .simple()
                                    .content('The specified services are now terminating.')
                                    .position('top right')
                                    .theme('admiral');
                            }

                            $mdToast.show(toast);

                            $scope.selectedServices = [];

                            $scope.load(false);
                        }
                    });
            })($scope.selectedServices[i]);
        }
    };

    /**
     * Change the state of the currently selected services
     */
    $scope.changeSelectedState = function(state, label, labelIng) {
        var loading = $scope.selectedServices.length;
        $scope.loading = true;

        var failed = [];

        for(var i = 0; i < $scope.selectedServices.length; i++) {
            (function(service) {
                $http({
                    method: 'PUT',
                    url: ConfigService.api + '/v1/services/' + service + '/state',
                    data: JSON.stringify({
                        state: state
                    }),

                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .catch(function(err) {
                        failed.push(service);
                    })
                    .finally(function() {
                        loading--;

                        if(loading == 0) {
                            $scope.loading = false;

                            var toast;
                            if(failed.length) {
                                toast = $mdToast
                                    .simple()
                                    .content(failed.length + ' services failed to ' + label + '.')
                                    .position('top right')
                                    .action('Ok')
                                    .hideDelay(false)
                                    .theme('admiral');
                            } else {
                                toast = $mdToast
                                    .simple()
                                    .content('The specified services are now ' + labelIng + '.')
                                    .position('top right')
                                    .theme('admiral');
                            }

                            $mdToast.show(toast);

                            $scope.selectedServices = [];

                            $scope.load(false);
                        }
                    });
            })($scope.selectedServices[i]);
        }
    };

    /**
     * Load the services
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
                if($scope.applicationId) {
                    $scope.applications = result.data.filter(function(application) {
                        return application.id = $scope.applicationId;
                    });

                    $scope.application = $scope.applications[0];
                } else {
                    $scope.applications = result.data;
                }
            })
            .finally(function() {
                $scope.loading = false;
            });
    };

    // Initialize
    $scope.load();
}];