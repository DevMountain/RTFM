angular.module('rtfmApp').controller('threadsCtrl', function(threadsRef, $scope, $firebaseArray) {

	console.log("here?");

	$scope.threads = $firebaseArray(threadsRef);

	$scope.threads.$loaded().then(function(threads) {
		console.log("huh?");
	});

	$scope.createThread = function(username, title) {
		$scope.threads.$add({
			username: username,
			title: title
		});
	};
});