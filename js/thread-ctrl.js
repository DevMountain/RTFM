angular.module('rtfmApp').controller('threadCtrl', function(threadRef, commentsRef, $scope, $firebaseObject, $firebaseArray, UserService) {
	var thread = $firebaseObject(threadRef);

	thread.$bindTo($scope, 'thread');

	$scope.comments = $firebaseArray(commentsRef);

  $scope.createComment = function(text) {
    $scope.comments.$add({
      username: UserService.getUser().password.email,
      text: text
    });
  };

});