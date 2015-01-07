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

  .controller('WorkoutsTabCtrl', ['$scope', '$state', '$stateParams', '$ionicPopup', 'Workout', function($scope, $state, $stateParams, $ionicPopup, Workout){
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
          $state.go('workout', {wkId: workout.workoutId});
        }
      });
    };
  }])

  .controller('WorkoutCtrl', ['$scope', '$stateParams', '$ionicSlideBoxDelegate', 'Workout', function($scope, $stateParams, $ionicSlideBoxDelegate, Workout){
    // init scope vars
    $scope.workout = {};

    // set slide-box so it can only be controlled via script/buttons
    angular.element(document).ready(function(){$ionicSlideBoxDelegate.enableSlide(false);});

    // look up workout based on state params passed in the query string
    if($stateParams.dayId){
      // console.log('dayId:', $stateParams.dayId);
      Workout.findByDayId($stateParams.dayId).then(function(res){
        $scope.workout = res.data.workout;
        $ionicSlideBoxDelegate.update();
      });
    }else if($stateParams.wkId){
      // console.log('wkId:', $stateParams.wkId);
      Workout.findById($stateParams.wkId).then(function(res){
        $scope.workout = res.data.workout;
        $ionicSlideBoxDelegate.update();
      });
    }

    // functions to control slider
    function next(){
      $ionicSlideBoxDelegate.next();
    }
    function prev(){
      $ionicSlideBoxDelegate.previous();
    }
    $scope.nextSlide = next;
    $scope.prevSlide = prev;

    // functions to format exercise stats for display
    $scope.formatWeight = function(lbs, verbose){
      if(lbs === 0){
        return verbose ? 'Body Weight' : 'BW'; // 0lbs is a body weight (bw) exercise
      }else{
        return lbs + ' lbs';
      }
    };
    $scope.formatReps = function(reps, type){
      // console.log(reps, type);
      if(reps === 0){
        return 'Till Fail';
      }else{
        return reps + ' ' + type[0].toUpperCase() + type.substring(1);
      }
    };
    $scope.formatRest = function(rest){
      if(rest === 0){
        return 'None';
      }else{
        return rest + ' Sec';
      }
    };

    $scope.startWorkout = function(){
      next(); // changes slide from initial pos, which fires beginSet below
    };

    $scope.beginSet = function(slideIndex){
      // there is 1 more slide than there are sets
      var setIndex = slideIndex - 1;
      // init scope vars to run workouts
      $scope.setRep = 1;
      $scope.eIndex = 0;
      $scope.currentSet = $scope.workout.sets[setIndex];
      if($scope.currentSet){
        $scope.checkExercise();
      }
    };

    // functions to run workout
    $scope.checkExercise = function(){
      if($scope.eIndex < $scope.currentSet.exercises.length){
        $scope.currentExr = $scope.currentSet.exercises[$scope.eIndex];
        $scope.runExercise();
      }else{
        $scope.runNextSet();
      }
    };

    $scope.runExercise = function(){
      console.log('runExercise', $scope.currentExr);
    };

    $scope.runNextSet = function(){
      console.log('runNextSet fired');
      next();
    };

    $scope.nextExr = function(){
      $scope.eIndex++;
      $scope.checkExercise();
    };
  }])

  .controller('AccountCtrl', ['$scope', function($scope){
    $scope.settings = {
      enableFriends: true
    };
  }]);
})();
