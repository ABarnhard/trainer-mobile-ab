(function(){
  'use strict';

  angular.module('abTimerModule', [])
  .directive('abTimer', ['$interval', function($interval){
    var o = {};

    o.restrict    = 'A';
    o.templateUrl = '/directives/timer/ab-timer.html';
    o.scope       = {secs:'@'};
    o.link        = function(scope, element, attrs){
                      var count = parseInt(scope.secs, 10) + 1, // add 1 since we decrement immediately
                          intId;

                      function updateTime(){
                        scope.secsLeft = count - 1;
                        if(count <= 0){
                          $interval.cancel(intId);
                        }
                      }
                      intId = $interval(updateTime, 1000);

                      element.on('$destroy', function(){
                        $interval.cancel(intId);
                      });

                      updateTime();
                    };
    return o;
  }]);
})();
