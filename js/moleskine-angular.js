
/* global angular */

/**
 * @doc module
 * @id MoleskineModule
 * @description MoleskineModule
 *
 * @author Alexandre Strzelewicz <as@unitech.io>
 */

var MoleskineModule = angular.module('MoleskineModule', []);

/**
 * @doc directive
 * @id MoleskineModule:moleskine
 * 
 * @description Moleskine directive for AngularJS
 * @author Alexandre Strzelewicz <as@unitech.io>
 */
MoleskineModule.directive('moleskine', [function() {
  var moleskine = {
    restrict : 'E',
    replace  : true,
    scope    : { 
      bindData    : '=',
      baseContent : '=',
      width       : '@',
      height      : '@',
      input       : '@',
      output      : '@',
      defaultMode : '@',
      cssClass    : '@',
      autoGrow    : '@'
    },
    template : '<textarea></textarea>'
  };
  
  moleskine.controller = ['$scope', function($scope, el, attrs) {
    
  }];
  
  moleskine.link = function(scope, el, attrs, ngModel) {
    console.log(scope);
      var a = $(el).moleskine({
        width         : scope.width,
        height        : scope.height,
        defaultMode   : scope.defaultMode,
        input         : scope.input,
        output        : scope.output,
        autoGrow      : scope.autoGrow,
        change        : function(err, content) {
          var phase = scope.$root.$$phase;
          
          scope.bindData = content;
          
          if (!(phase == '$apply' || phase == '$digest')) {
            scope.$apply();
          }          
        }
      });

    if (scope.baseContent)
      a.set_content(scope.baseContent);
    
    scope.$watch('baseContent', function(aft, bef) {
      if (aft == bef) return;
      a.set_content(aft);
    });
  };

  return moleskine;
}]);


