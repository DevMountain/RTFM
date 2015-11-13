angular.module('rtfmApp').service('UserService', function(firebaseUrl, Firebase, $firebaseAuth, $q, $state) {

	var authRef = new Firebase(firebaseUrl.url);
	var auth = $firebaseAuth(authRef);

	auth.$onAuth(function(authData) {
		if (!authData) {
			$state.go('login')
		}
	});

	this.getUser = function() {
		return auth.$getAuth();
	};

	this.register = function(newUser) {
		return auth.$createUser(newUser);
	};

	this.login = function(user) {
		return auth.$authWithPassword(user);
	};
	this.logout = function(user) {
		return auth.$unauth();
	}
});