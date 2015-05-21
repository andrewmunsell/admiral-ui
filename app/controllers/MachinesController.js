/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

module.exports = ['$scope', '$http', '$mdDialog', 'ConfigService', function($scope, $http, $mdDialog, ConfigService) {
    $scope.machines = null;
    $scope.loading = false;

    /**
     * Load the machines
     */
    $scope.load = function() {
        $scope.loading = true;

        $http.get(ConfigService.api + '/v1/machines')
            .then(function(result) {
                $scope.loading = false;
                $scope.machines = result.data;
            });
    };

    /**
     * View the machine information
     */
    $scope.viewMachine = function(machineId) {
        var machine = $scope.machines.filter(function(machine) {
            return machine.machine == machineId;
        })[0];

        var childScope = $scope.$new(true);
        childScope.machine = machine;

        $mdDialog.show({
            controller: require('./MachineDetailsController'),
            templateUrl: 'app/views/machine-details.html',
            theme: 'admiral',
            scope: childScope
        });
    };

    // Initialize
    $scope.load();
}];