(function(){
  'use strict';
  angular.module('trainer', ['ionic', 'timer', 'trainer.controllers', 'trainer.services', 'trainer.values', 'trainer.directives'])
  .run(function($ionicPlatform){
    $ionicPlatform.ready(function(){
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard){
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar){
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })
  .config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $httpProvider.defaults.withCredentials = true;

    $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/user/login.html',
      controller: 'LoginCtrl'
    })

    .state('workout', {
      cache: false,
      url: '/workout',
      abstract: true,
      templateUrl: 'templates/workout/workouts.html'
    })

    .state('workout.do', {
      url: '?wkId&dayId',
      templateUrl: 'templates/workout/workout.html',
      controller: 'WorkoutCtrl'
    })

    .state('workout.finished', {
      url: '/finished?wkName&dayId',
      templateUrl: 'templates/workout/workout_finished.html',
      controller: 'wkFinishedCtrl'
    })

    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs/tabs.html'
    })

    // Each tab has its own nav history stack:
    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tabs/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.regimes', {
      url: '/regimes',
      views: {
        'tab-workouts': {
          templateUrl: 'templates/tabs/tab-regimes.html',
          controller: 'RegimesCtrl'
        }
      }
    })

    .state('tab.phases', {
      url: '/regimes/:regimeId',
      views: {
        'tab-workouts': {
          templateUrl: 'templates/tabs/tab-phases.html',
          controller: 'PhasesCtrl'
        }
      }
    })

    .state('tab.workouts', {
      url: '/regimes/:regimeId/phases/:phaseId',
      views: {
        'tab-workouts': {
          templateUrl: 'templates/tabs/tab-workouts.html',
          controller: 'WorkoutsTabCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tabs/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  });
})();
