'use strict';

angular.module('rtfmApp')
  .controller('LoginCtrl', function ($scope, $location, UserService) {
    $scope.logIn = function (user) {
      UserService.logIn(user).then(function (user) {
        console.log('log in success', user);
        $location.url('/thread');
      }, function (error) {
        console.log('log in error', error);
      })
    };

    $scope.createUser = function (user) {
      UserService.createUser(user).then(function (currentUser) {
        UserService.logIn(user).then(function () {
          $location.url('/thread');
        }, function (error) {
          alert(error);
        });

      }, function (error) {
        alert(error.message);
      });
    };
  });
