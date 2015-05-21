/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

module.exports = ['$scope', function($scope) {
    // Ports
    $scope.ports = [
        { port: 22, label: '22 (SSH)'},
        { port: 53, label: '53 (DNS)'},
        { port: 80, label: '80 (HTTP)'},
        { port: 443, label: '443 (HTTPS)'}
    ];

    // Defaults
    $scope.$parent.$parent.service.name = null;
    $scope.$parent.$parent.service.units = 0;
    $scope.$parent.$parent.service.router = {
        ports: []
    };

    $scope.$watch('registerWithRouter', function(registered) {
        // Add a default port when registering with the router
        if(registered && !$scope.$parent.$parent.service.router.ports.length) {
            $scope.$parent.$parent.service.router.ports.push(80);
        } else if(!registered) {
            $scope.$parent.$parent.service.router.ports = [];
        }
    });
}];