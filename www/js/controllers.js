(function(){
  'use strict';
  angular.module('trainer.controllers', [])

  .controller('DashCtrl', ['$scope', function($scope){

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
