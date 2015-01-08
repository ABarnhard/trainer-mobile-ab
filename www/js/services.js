(function(){
  'use strict';
  angular.module('trainer.services', [])

  .factory('User', ['$http', 'origin', function($http, origin){
    function login(user){
      return $http.post(origin + '/login', user);
    }

    function logout(){
      return $http.delete(origin + '/logout');
    }

    return {
      login: login,
      logout: logout
    };
  }])

  .factory('Schedule', ['$http', 'origin', function($http, origin){
    function getDay(day){
      return $http.get(origin + '/workouts/schedule/' + convertDateToString(day));
    }

    function markDayCompleted(dayId){
      return $http.post(origin + '/workouts/schedule/day/done', {dayId:dayId});
    }

    function convertDateToString(day){
      var s = day.getFullYear() + '-' + format(day.getMonth(), 'm') + '-' + format(day.getDate(), 'd');
      return s;
    }

    function format(d, type){
      if(type === 'm'){d += 1;}
      d = d.toString();
      if(d.length < 2){d = '0' + d;}
      return d;
    }

    return {
      getDay: getDay,
      markDayCompleted: markDayCompleted
    };
  }])

  .factory('Workout', ['$http', 'origin', function($http, origin){
    function getRegimes(){
      return $http.get(origin + '/regimes');
    }

    function getPhases(regimeId){
      return $http.get(origin + '/regimes/' + regimeId + '/phases');
    }

    function getWorkouts(phaseId){
      return $http.get(origin + '/phases/' + phaseId + '/workouts');
    }

    function findByDayId(dayId){
      return $http.get(origin + '/workouts/day/' + dayId);
    }

    function findById(wkId){
      return $http.get(origin + '/workouts/' + wkId);
    }

    return {
      getRegimes: getRegimes,
      getPhases: getPhases,
      getWorkouts: getWorkouts,
      findById: findById,
      findByDayId: findByDayId
    };
  }]);
})();
