'use strict';

angular.module('rtfmApp')
  .service('UserService', function UserService($q, $firebase, $firebaseSimpleLogin) {
    var firebase = new Firebase('https://rtfm-chris.firebaseIO.com'),
      firebaseSimpleLogin = $firebaseSimpleLogin(firebase);

    return {
      getCurrentUser: firebaseSimpleLogin.$getCurrentUser,
//
//      getCurrentUser: function () {
//        var deferred = $q.defer();
//
//        firebaseSimpleLogin.$getCurrentUser().then(deferred.resolve, deferred.reject);
//
//        return deferred.promise;
//      },

      createUser: function (user) {
        return firebaseSimpleLogin.$createUser(user.email, user.password);
      },

      logIn: function (user) {
        user.rememberMe = true; // Persist log in after window close for up to 30 days.
        return firebaseSimpleLogin.$login('password', user);
      },

      logOut: function () {
        var deferred = $q.defer();

        firebaseSimpleLogin.$logout();

        firebaseSimpleLogin.$getCurrentUser().then(function (user) {
          console.log('not logged out', user);
          if (user) {
            deferred.reject(user);
          } else {
            console.log('logged out', user);
            deferred.resolve(user);
          }

        }, function (error) {
          console.warn('error', error);

        });

        return deferred.promise;
      }
    };
  });
