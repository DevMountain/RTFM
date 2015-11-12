angular.module('rtfmApp').controller('threadCtrl', function(threadRef, commentsRef, $scope, $firebaseObject, $firebaseArray) {
	var thread = $firebaseObject(threadRef);

	thread.$bindTo($scope, 'thread');

	$scope.comments = $firebaseArray(commentsRef);

  $scope.createComment = function(username, text) {
    $scope.comments.$add({
      username: username,
      text: text
    });
  };

});