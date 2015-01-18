(function(){
  'use strict';

  angular.module('trainer.directives', [])
  .directive('workoutSlider', [function(){
    var directiveDefinitionObject = {
      templateUrl: 'directives/workout-slider.html', // or // function(tElement, tAttrs) { ... },
      transclude: false,
      restrict: 'E',
      templateNamespace: 'html',
      scope: {
        workout:'=wk',
        mainSlideChange: '&mSlideChange'
      },
      controller: function($scope, $element, $attrs, $transclude){},
      compile: function compile(tElement, tAttrs, transclude){
        return {
          pre: function preLink(scope, iElement, iAttrs){},
          post: function postLink(scope, iElement, iAttrs){}
        };
        // or
        // return function postLink( ... ) { ... }
      }
      // or
      // link: {
      //  pre: function preLink(scope, iElement, iAttrs, controller) { ... },
      //  post: function postLink(scope, iElement, iAttrs, controller) { ... }
      // }
      // or
      // link: function postLink( ... ) { ... }
    };
    return directiveDefinitionObject;
  }]);
})();
