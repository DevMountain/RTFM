angular.module('rtfmApp').controller('signupCtrl', function($scope, UserService) {

	$scope.register = function() {
		UserService.register($scope.newUser).then(function(userRef) {
		}).catch(function(err) {
			console.log("Error", err);
		})
	}
});