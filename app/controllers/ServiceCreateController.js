/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

module.exports = ['$scope', '$controller', function($scope, $controller) {
    $scope.template = null;
    $scope.selectedTemplate = false;

    $scope.service = {};

    $scope.templates = {
        'fleet-units': {
            name: 'Fleet Unit Files',
            steps: [
                {
                    label: 'Unit Files',
                    template: 'fleet-units-unit-files'
                },

                {
                    label: 'Settings',
                    template: 'fleet-units-settings'
                }
            ]
        }
    };

    /**
     * Lock in the template choice
     */
    $scope.chooseTemplate = function() {
        $scope.selectedTemplate = true;
        $scope.service.template = $scope.template;
    };

    /**
     * Load the service creation page
     */
    $scope.load = function() {
        // Add the "Finish" page
        for(var i in $scope.templates) {
            $scope.templates[i].steps.push({
                label: 'Finish',
                template: 'finish'
            });
        };
    };

    // Initialize
    $scope.load();
}];