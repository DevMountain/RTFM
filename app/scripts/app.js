'use strict';

angular
  .module('rtfmApp', ['firebase', 'ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/thread', {
        templateUrl: 'views/thread.html',
        controller: 'ThreadCtrl',
        resolve: {
          currentUser: function (UserService) {
            return UserService.getCurrentUser();
          }
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({ redirectTo: '/thread' })
  });
