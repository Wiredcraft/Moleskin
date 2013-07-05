
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
MoleskinExample.controller('Moleskin', ['$scope', '$location', '$http', '$anchorScroll', function($scope, $location, $http, $anchorScroll) {
  $scope.static_content = '# Moleskin !\nI can display a classic WYSIWYG interface for **mainstream users**, but the output will still be markdown.\n\n For Markdown user, you just have to click on ![MD](https://raw.github.com/dcurtis/markdown-mark/master/png/32x20.png)\n\n Check that buttons on top !\n##Features\n\
    - 34kb\n\
    - Html to [Markdown](http://daringfireball.net/projects/markdown/)\n\
    - Markdown to Html\n\
    - AutoGrow feature\n\
  \n![digital-moleskin](http://swotti.starmedia.com/tmp/swotti/cacheBW9SZXNRAW4=/imgMoleskin5.jpg)';

  $scope.scrollTo = function(id) {
    $location.hash(id);
    $anchorScroll();
  };
}]);
