angular.module('rtfmApp').controller('loginCtrl', function($scope, UserService, $state) {

	$scope.login = function() {
		UserService.login($scope.user).then(function(authedUser) {
			$state.go('threads');
		}).catch(function(err) {
			console.log("bad login", err);
		})
	};
});