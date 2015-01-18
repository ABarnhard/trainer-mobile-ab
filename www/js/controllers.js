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
        $scope.disabled = false;
        $scope.user = {};
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
          $state.go('workout.do', {wkId: workout.workoutId});
        }
      });
    };
  }])

  .controller('WorkoutCtrl', ['$scope', '$state', '$stateParams', '$location', '$ionicSlideBoxDelegate', '$ionicPopup', '$timeout', '$compile', 'Workout', function($scope, $state, $stateParams, $location, $ionicSlideBoxDelegate, $ionicPopup, $timeout, $compile, Workout){
    $scope.beginExercise = function(index){console.log(index);};

    /*
    function startTimer(sectionId) {
      document.getElementById(sectionId).getElementsByTagName('timer')[0].start();
    }

    function stopTimer(sectionId) {
      document.getElementById(sectionId).getElementsByTagName('timer')[0].stop();
    }

    function addCDSeconds(sectionId, extraTime) {
      document.getElementById(sectionId).getElementsByTagName('timer')[0].addCDSeconds(extraTime);
    }

    function stopResumeTimer(sectionId, btn) {
      if (btn.innerHTML === 'Start') {
        document.getElementById(sectionId).getElementsByTagName('timer')[0].start();
        btn.innerHTML = 'Stop';
      }
      else if (btn.innerHTML === 'Stop') {
        document.getElementById(sectionId).getElementsByTagName('timer')[0].stop();
        btn.innerHTML = 'Resume';
      }
      else {
        document.getElementById(sectionId).getElementsByTagName('timer')[0].resume();
        btn.innerHTML = 'Stop';
      }
    }
    */

    // init scope vars
    $scope.workout = {};
    $scope.setIndex = -1;
    $scope.timerRunning = false;
    $scope.timerDone = false;
    $scope.stopSet = false;
    $scope.doSet = false;

    function slideBox(name){
      $ionicSlideBoxDelegate.update();
      return $ionicSlideBoxDelegate.$getByHandle(name);
    }

    // set slide-box so it can only be controlled via script/buttons
    angular.element(document).ready($timeout(function(){slideBox('mainSlider').enableSlide(false);}, 0));
    //angular.element(document).ready($timeout(function(){$ionicSlideBoxDelegate.enableSlide(false);}, 0));

    // look up workout based on state params passed in the query string
    if($stateParams.dayId){
      // console.log('dayId:', $stateParams.dayId);
      Workout.findByDayId($stateParams.dayId).then(function(res){
        $scope.workout = res.data.workout;
        // var $slide = angular.element('<ion-slide><ion-slide-box delegate-handle="setSliderTest" show-pager="false" on-slide-changed="beginExercise($index)"><ion-slide><h2>Test slide inside manually apended slider</h2></ion-slide></ion-slide-box></ion-slide>'),
        var slide  = '<ion-slide><ion-slide-box delegate-handle="setSliderTest" show-pager="false" on-slide-changed="beginExercise($index)"><ion-slide><h2>Test slide inside manually apended slider</h2></ion-slide></ion-slide-box></ion-slide>',
            $slide = $compile(slide)($scope);
        console.log($slide);
        angular.element('#workout-slidebox .slider-slides').append($slide);
        $timeout(function(){
          $ionicSlideBoxDelegate.update();
        }, 0);
      });
    }else if($stateParams.wkId){
      // console.log('wkId:', $stateParams.wkId);
      Workout.findById($stateParams.wkId).then(function(res){
        $scope.workout = res.data.workout;
        // var $slide = angular.element('<ion-slide><ion-slide-box delegate-handle="setSliderTest" show-pager="false" on-slide-changed="beginExercise($index)"><ion-slide><h2>Test slide inside manually apended slider</h2></ion-slide></ion-slide-box></ion-slide>'),
        var slide  = '<ion-slide-box delegate-handle="setSliderTest" show-pager="false" on-slide-changed="beginExercise($index)"><ion-slide><h2>Test slide inside manually apended slider</h2></ion-slide></ion-slide-box>',
            $slide = $compile(slide)($scope);
        // console.log($slide);
        $timeout(function(){angular.element('#workout-slidebox .slider-slides ion-slide[data-index="1"]').append($slide);}, 1);
        //$timeout(function(){
        //  $ionicSlideBoxDelegate.update();
        //  }, 0);
      });
    }else{
      $state.go('tab.dash');
    }

    // function to quit workout, uses location to force refresh and reset all states
    $scope.quit = function(){
      $state.go('tab.dash');
    };

    $scope.startWorkout = function(){
      next('mainSlider'); // changes slide from initial pos, which fires beginSet below
    };

    $scope.endWorkout = function(){
      // console.log('workout is over');
      $state.go('workout.finished', {wkName: $scope.workout.workoutName, dayId:$stateParams.dayId});
    };

    // functions to control slider
    function next(name){
      $timeout(function(){slideBox(name).next();}, 0);
    }

    // for testing
    function prev(name){
      slideBox(name).previous();
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
    $scope.formatName = function(name){
      if(name.length <= 22){
        return name;
      }else{
        return name.substr(0, 20) + '...';
      }
    };

    $scope.beginSet = function(slideIndex){
      // there is 1 more slide than there are sets
      $scope.setIndex = slideIndex - 1;
      // init scope vars to run workouts
      $scope.setRep = 1;
      $scope.eIndex = 0;
      $scope.currentSet = $scope.workout.sets[$scope.setIndex];
      if($scope.currentSet){
        $scope.checkExercise();
      }
    };

    $scope.nextExercise = function(){
      $scope.currentExr = $scope.currentSet.exercises[$scope.eIndex];
      $scope.runExercise();
    };

    // functions to run workout
    $scope.checkExercise = function(){
      if($scope.eIndex < $scope.currentSet.exercises.length){
        $scope.nextExercise();
      }else{
        showRestModal();
      }
    };

    $scope.runExercise = function(){
      // TODO This is where the logic to handle sets and timed excercises better will go
      // console.log('run exercise');
    };

    $scope.nextExr = function(){
      $scope.eIndex++;
      $scope.timerRunning = $scope.timerDone = false;
      $scope.doSet = $scope.stopSet = false;
      $scope.checkExercise();
    };

    $scope.startTimer = function(){
      $scope.$broadcast('timer-start');
      $scope.timerRunning = true;
      $scope.doSet = true;
    };

    $scope.timerFinished = function(){
      $scope.timerDone = true;
      $scope.doSet = false;
      $scope.stopSet = true;
      $scope.$digest();
    };

    // function to control rest modal between sets
    function showRestModal(){
      // if the workout is over, go to finishe & don't show rest modal
      if($scope.setRep >= $scope.currentSet.count && $scope.setIndex === $scope.workout.sets.length - 1){
        return $scope.endWorkout();
      }

      // if there is no rest, go straight to next set
      if($scope.currentSet.rest === 0){return nextExcOrSet();}

      // define handle to timeout, timeoutId is actually a promise object
      var timeoutId = $timeout(function(){
            restModal.close();
            nextExcOrSet();
          }, parseInt(($scope.currentSet.rest * 1000), 10)),
          // create modal
          restModal = $ionicPopup.show({
            template: '<div style="text-align:center;font-size:2em;font-weight:bold;"><timer countdown="currentSet.rest" interval="1000">{{mminutes}}:{{sseconds}}</timer></div>',
            title: 'Time To Rest',
            subTitle: 'Hit Cancel if you\'r ready to go',
            scope: $scope,
            buttons: [{text: 'Cancel'}]
          });

      restModal.then(function(res){
        $timeout.cancel(timeoutId);
        nextExcOrSet();
      });
    }

    // move on to next set or end workout
    function nextExcOrSet(){
      if($scope.setRep < $scope.currentSet.count){
        $scope.setRep++; // increment current rep
        $scope.eIndex = 0; // reset exercise index
        $scope.nextExercise();
      }else{
        next('mainSlider');
      }
    }
  }])

  .controller('wkFinishedCtrl', ['$scope', '$stateParams', 'Schedule', function($scope, $stateParams, Schedule){
    $scope.wkName = $stateParams.wkName;

    if($stateParams.dayId){ // if we just completed a day, mark it complete in db
      Schedule.markDayCompleted($stateParams.dayId).then(function(res){
        console.log('day completed');
        angular.noop();
      }, function(res){
        console.log('ERROR COMPLETING DAY:', res);
      });
    }
  }])

  .controller('AccountCtrl', ['$scope', '$state', '$location', 'User', function($scope, $state, $location, User){
    $scope.logOut = function(){
      User.logout().then(function(res){
        $location.path('#/login');
      }, function(res){
        console.log('ERROR Logging Out', res);
      });
    };
  }]);
})();
