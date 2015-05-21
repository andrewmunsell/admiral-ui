/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

module.exports = ['$scope', '$route', '$mdSidenav', function($scope, $route, $mdSidenav) {
    $scope.route = $route;

    $scope.toggleSidebar = function() {
        $mdSidenav('main-nav')
            .toggle();
    };
}];