
/* global angular */

/**
 * @doc module
 * @id MoleskineModule
 * @description MoleskineModule
 *
 * @author Alexandre Strzelewicz <as@unitech.io>
 */

var MoleskineModule = angular.module('MoleskineModule', []);

// MoleskineModule.constant('version', '0.1');

// MoleskineModule.config(function() { 
// });

// MoleskineModule.run(function() { 
// });

/**
 * @doc directive
 * @id MoleskineModule:moleskine
 * 
 * @description Moleskine directive for AngularJS
 * @author Alexandre Strzelewicz <as@unitech.io>
 */
MoleskineModule.directive('moleskine', ['$http', function($http) {  
  var moleskine = {
    restrict : 'E',
    replace  : true,
    scope    : { 
      width    : '@',
      height   : '@',
      bindData : '=',
      baseContent : '='
    },
    template : '<textarea></textarea>'
  };
  
  moleskine.controller = ['$scope', function($scope, el, attrs) {
    
  }];
  
  moleskine.link = function(scope, el, attrs, ngModel) {
      var a = $(el).moleskine({
        width         : scope.width,
        height        : scope.height,
        controls_rte  : rte_toolbar,
        controls_html : html_toolbar,
        controls_md   : md_toolbar,
        input         : 'markdown',
        output        : 'markdown',
        change        : function(err, content) {
          scope.bindData = content;
          scope.$apply();
        }
      });

    scope.$watch('baseContent', function(aft, bef) {
      if (aft == bef) return;
      a.set_content(aft);
    });
  };

  return moleskine;
}]);


