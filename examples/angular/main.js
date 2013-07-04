
/* global angular */

/**
 * @doc module
 * @id MoleskinExample
 * @description MoleskinExample
 *
 * @author Alexandre Strzelewicz <as@unitech.io>
 */

var MoleskinExample = angular.module('MoleskinExample', ['MoleskineModule']);

MoleskinExample.constant('version', '0.1');

/**
 * @doc controller
 * @id MoleskinExample:MoleskinExample
 * @view 
 * @description 
 * @author Alexandre Strzelewicz <as@unitech.io>
 */
MoleskinExample.controller('Moleskin', ['$scope', '$location', function($scope, $location) {
  $scope.static_content = 'Hey';
}]);
