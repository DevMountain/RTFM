'use strict';

angular.module('rtfmApp')
  .controller('ThreadCtrl', function ($scope, $location, $firebase, UserService, currentUser) {
    var threadsRef = $firebase(new Firebase('https://rtfm-chris.firebaseIO.com/threads'));
    console.log('user', currentUser);

    if (!currentUser) {
      alert('not logged in');
      $location.url('/login');
    };


    $scope.currentUser = currentUser;

    $scope.threads = threadsRef;
    $scope.newThread = {};
    $scope.newReply = {};

    threadsRef.$bind($scope, 'threads');

    $scope.addThread = function (thread) {
      threadsRef.$add(thread).then(function () {
        $scope.newThread = {}; // Set $scope.newThread to an empty object
      });
    };

    $scope.addReply = function (key, reply) {
      threadsRef.$child(key).$child('replies').$add(reply).then(function () {
        reply = {}; // Does not work
      });
    };

    $scope.deleteReply = function (key, replyKey) {
      threadsRef.$child(key).$child('replies').$remove(replyKey);
    };

    $scope.logOut = function () {
      UserService.logOut().then(function () {
        console.log('You are logged out!');
        $location.url('/login');
      });
    };

  });
