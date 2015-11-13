angular.module('rtfmApp').controller('threadsCtrl', function(threadsRef, $scope, $firebaseArray, UserService, $state) {

	$scope.threads = $firebaseArray(threadsRef);

	$scope.createThread = function(username, title) {
		$scope.threads.$add({
			username: UserService.getUser().$email,
			title: title
		});
	};
});