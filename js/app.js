var app = angular.module('rtfmApp', ['firebase', 'ui.router']);

app.constant('fb', {
    url: "https://myladrilloforum.firebaseio.com"
});

app.config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider
            .otherwise('/threads');

        $stateProvider
            .state('threads', {
                url: '/threads',
                templateUrl: 'js/threads/threads.html',
                controller: 'threadsCtrl',
                resolve: {
                    threadsRef: function (threadService) {
                        return threadService.getThreads();
                    }
                }
            })

            .state('thread', {
                url: '/threads/:threadId',
                templateUrl: 'js/thread/thread.html',
                controller: 'threadCtrl',
                resolve: {
                    threadRef: function (threadService, $stateParams) {
                        return threadService.getThread($stateParams.threadId);
                    },
                    commentsRef: function (threadService, $stateParams) {
                        return threadService.getComments($stateParams.threadId);
                    }
                }
            });
    });