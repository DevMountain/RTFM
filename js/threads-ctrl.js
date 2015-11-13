angular.module('rtfmApp').controller('threadsCtrl', function(threadsRef, $scope, $firebaseArray, UserService, $state) {

	$scope.threads = $firebaseArray(threadsRef);

	$scope.createThread = function(title) {
		$scope.threads.$add({
			username: UserService.getUser().password.email,
			title: title
		});
	};
});