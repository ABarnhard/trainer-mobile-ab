(function(){
  'use strict';
  angular.module('trainer.controllers', [])

  .controller('DashCtrl', ['$scope', function($scope){

  }])

  .controller('LoginCtrl', ['$scope', 'User', function($scope, User){

  }])

  .controller('ChatsCtrl', ['$scope', 'Chats', function($scope, Chats){
    $scope.chats = Chats.all();
    $scope.remove = function(chat){
      Chats.remove(chat);
    };
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
