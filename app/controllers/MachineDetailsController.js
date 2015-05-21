/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

module.exports = ['$scope', '$mdDialog', function($scope, $mdDialog) {
    /**
     * Close the dialog
     */
    $scope.close = function() {
        $mdDialog.hide();
    };
}];