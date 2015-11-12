var app = angular.module('rtfmApp', ['firebase', 'ui.router']);

app.constant('firebaseUrl', {
	url: 'https://rtfm-cahlan.firebaseio.com/cahlan'
})

app.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('threads', {
			url: '/threads',
			controller: 'threadsCtrl',
			templateUrl: '/templates/threads.html',
			resolve: {
				threadsRef: function(ThreadService) {
					return ThreadService.getThreads();
				}
			}
		})
		.state('thread', {
			url: '/threads/:threadId',
			controller: 'threadCtrl',
			templateUrl: '/templates/thread.html',
			resolve: {
				threadRef: function(ThreadService, $stateParams) {
					return ThreadService.getThread($stateParams.threadId);
				},
				commentsRef: function(ThreadService, $stateParams) {
					return ThreadService.getComments($stateParams.threadId);
				}
			}
		});

	$urlRouterProvider.otherwise('/threads');

});