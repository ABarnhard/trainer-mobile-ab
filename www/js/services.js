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
      return $http.post('/schedule/day/complete', {dayId:dayId});
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
  }])

  .factory('Chats', [function(){
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
    }, {
      id: 2,
      name: 'Andrew Jostlin',
      lastText: 'Did you get the ice cream?',
      face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
    }, {
      id: 3,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }, {
      id: 4,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
    }];

    return {
      all: function(){
        return chats;
      },
      remove: function(chat){
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function(chatId){
        for (var i = 0; i < chats.length; i++){
          if (chats[i].id === parseInt(chatId)){
            return chats[i];
          }
        }
        return null;
      }
    };
  }]);
})();
