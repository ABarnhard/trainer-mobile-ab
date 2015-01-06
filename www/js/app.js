(function(){
  'use strict';
  angular.module('trainer', ['ionic', 'trainer.controllers', 'trainer.services', 'trainer.values'])
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
    // setup an abstract state for the tabs directive
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:
    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.regimes', {
      url: '/regimes',
      views: {
        'tab-workouts': {
          templateUrl: 'templates/tab-regimes.html',
          controller: 'RegimesCtrl'
        }
      }
    })

    .state('tab.phases', {
      url: '/regimes/:regimeId',
      views: {
        'tab-workouts': {
          templateUrl: 'templates/tab-phases.html',
          controller: 'PhasesCtrl'
        }
      }
    })

    .state('tab.workouts', {
      url: '/regimes/:regimeId/phases/:phaseId',
      views: {
        'tab-workouts': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  });
})();
