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

  .controller('WorkoutsTabCtrl', ['$scope', '$stateParams', '$ionicPopup', 'Workout', function($scope, $stateParams, $ionicPopup, Workout){
    $scope.workouts = [];

    Workout.getWorkouts($stateParams.phaseId).then(function(res){
      $scope.workouts = res.data.workouts;
    });

    $scope.showConfirm = function(workout){
      var confirmPopup = $ionicPopup.confirm({
        title: 'Begin Workout',
        template: 'Are you sure you want begin ' + workout.workoutName + '?'
      });
      confirmPopup.then(function(res){
        if(res){
          console.log('You are sure');
        }else{
          console.log('You are not sure');
        }
      });
    };
  }])

  .controller('WorkoutCtrl', ['$scope', '$stateParams', '$ionicSlideBoxDelegate', 'Workout', function($scope, $stateParams, $ionicSlideBoxDelegate, Workout){
    if($stateParams.dayId){
      console.log('dayId:', $stateParams.dayId);
    }else if($stateParams.wkId){
      console.log('wkId:', $stateParams.wkId);
    }else{
      console.log('This is all busted...in the workouts controller');
    }
  }])

  .controller('AccountCtrl', ['$scope', function($scope){
    $scope.settings = {
      enableFriends: true
    };
  }]);
})();
