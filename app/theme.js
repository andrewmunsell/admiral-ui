/**
 * @package admiral-ui
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 WizardApps
 */

module.exports = ['$mdThemingProvider', function($mdThemingProvider) {
    /**
     * Primary theme for Admiral
     */
    $mdThemingProvider.theme('admiral')
        .primaryPalette('blue')
        .accentPalette('orange', {
            'default': '500'
        })
        .warnPalette('red');
}];