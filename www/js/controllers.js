(function(){
  'use strict';
  angular.module('trainer.controllers', [])

  .controller('DashCtrl', ['$scope', 'Schedule', function($scope, Schedule){
    $scope.today = new Date();
    $scope.init = false;
    Schedule.getDay($scope.today).then(function(res){
      $scope.day = res.data.day;
      $scope.init = true;
    });
  }])

  .controller('LoginCtrl', ['$rootScope', '$scope', '$state', 'User', function($rootScope, $scope, $state, User){
    $scope.disabled = false;
    $scope.user = {};

    if($rootScope.rootUser){
      $state.go('tab.dash');
    }

    $scope.login = function(user){
      $scope.disabled = !$scope.disabled;
      User.login(user).then(function(res){
        $rootScope.rootUser = res.data;
        $state.go('tab.dash');
      }, function(res){
        $scope.disabled = !$scope.disabled;
        console.log('error logging in');
        $scope.user = {};
      });
    };
  }])

  .controller('RegimesCtrl', ['$scope', 'Workout', function($scope, Workout){
    $scope.regimes = [];
    Workout.getRegimes().then(function(res){
      $scope.regimes = res.data.regimes;
    });
  }])

  .controller('PhasesCtrl', ['$scope', '$stateParams', 'Workout', function($scope, $stateParams, Workout){
    $scope.phases = [];
    $scope.regimeId = $stateParams.regimeId;

    Workout.getPhases($stateParams.regimeId).then(function(res){
      $scope.phases = res.data.phases;
    });
  }])

  .controller('ChatDetailCtrl', ['$scope', '$stateParams', 'Chats', function($scope, $stateParams, Chats){
    $scope.chat = Chats.get($stateParams.chatId);
  }])

  .controller('AccountCtrl', ['$scope', function($scope){
    $scope.settings = {
      enableFriends: true
    };
  }]);
})();
