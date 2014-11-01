RTFM
====

A project start for practicing using Firebase with AngularJS.

We're going to create a multi-user, real-time forum (RTFM).

## Step 1: Create project
1. Create the basic structure of your Angular application naming your app 'rtfmApp'.
2. After you include Angular, include firebase, angularfire, and ngRoute as scripts in your html file (Google them), then the rest of your basic angular files.


## Step 2: Configure Module
1. In your app.js file include ```firebase``` and ```ngRoute``` to your module's dependencies.
3. Add a ```.config``` function and include ```$routeProvider``` to your injections.
4. Create a router and add ```/login```, ```/threads``` and ```/threads/:threadId``` as the URLS
5. Use .otherwise and redirectTo '/login'

## Step 3: Create Login View

1. In your index.html file include the following line to tie in your router.

```
<!-- Add your site or application content here -->
    <div class="container" ng-view></div>
```

2. Create a login folder and inside that folder create a login view and a login controller

3. Include your new view and controller in your ```login``` route.


## Step 3: Set Up Environment Variables

1. Create a new file at ```/app/env.js``` and set it up like so...

```
window.env = {
  "environment": "development",
  "firebase": "https://rtfm-demo.firebaseio.com/chris"
};
```

Feel free to use my ```rtfm-demo``` firebase, or create you own at [firebase.com](https://firebase.com). If you use
my firebase, please change the base to reflect your name rather than 'chris'. For example you could use
```https://rtfm-demo.firebaseio.com/supermario```. All this will do is nest your firebase data under ```supermario``` so
that your data doesn't mix with the rest of the group's.

2. Include ```env.js``` in your ```index.html``` file so that ```window.env``` is created before the rest of your
JS files load.

```
<!--Environment vars attached to window.env-->
  <script src="env.js"></script>

<!-- included scripts -->
  <script src="path/to/angular.js"></script>
  <script src="path/to/firebase.js"></script>
  <script src="etc/etc/etc"></script>
<!-- end scripts -->
```

3. Create an EnvironmentService to make your environment variables injectable into any Angular module.
```
angular.module('rtfmApp')
  .service('EnvironmentService', function EnvironmentService($window) {
    return {
      getEnv: function () {
        return $window.env;
      }
    }
  });
```

4. Inject ```EnvironmentService``` into your ```LoginCtrl``` and assign your environment to ```$scope.env```, then
read out ```{{ env }}}``` in your ```login.html``` view to confirm that your environment variables are injecting
correctly. You should see your ```window.env``` object logged out onto your login view.


## Step 4: Create a Login Form

1. Open up ```login.html``` and create a text input bound to ```$scope.username``` and a button that calls
```logMeIn(username)``` when clicked.

```
<p>This is the login view.</p>

<div>
    <input type="text" ng-model="username"/>
    <button ng-click="logMeIn(username)">Log In</button>
</div>
```

2. Create the ```logMeIn``` function in your ```LoginCtrl```. Have it ```alert``` the username for now.
3. Create a function in ```EnvironmentService``` called ```saveUsername``` that accepts a username and saves it to
local storage using ```$window.localStorage.setItem('username', username);```.
4. Create another function in ```EnvironmentSerice``` called ```getUsername``` that returns the username with $window.localStorage.getItem('username');

5. Inject ```$location``` into ```LoginCtrl``` and use it to forward the user to the ```threads``` route after login (which is /threads as the URL, hint, look up how to use $location to redirect to a different URL). Here's an example of how to do that. Change the code to work with your app. 
```
$scope.$apply(function(){
	$location.path('/dashboard/' + user.uid)
});
```

6. Create a ```threads.html``` view and a ```ThreadsCtrl``` controller in the appropriate folder. Add the new view and
controller to the ```threads``` route in ```app.js```.
7. Test your login and make sure that it forwards you to the stubbed threads view.


## Step 5: Protect our Routes
A problem we're going to run into as we're setting up our routing is sometimes we only want certain authenticated users to see certain routes. What we're going to do in this step is to secure our routes so only those people who we want to see certain routes will be able to. 

1. Head over to your app.js file and under your .config block, add a new .run block. This .run block will be the first thing that Angular runs before your app starts to be initialized. 
2. Pass the .run function a callback that accepts three parameters, ```$rootScope```, ```$location```, and ```EnvironmentService```. $rootScope is exactly like ```$scope```, but it's global in the sense that anywhere in your application you can get properties that are on ```$rootScope```. $location allows us to redirect to different locations if we need to. EnvironmentService is where we're going to check if our user is Authenticated.
3. Inside of our callback we're going to listen for the ```$routeChangeStart``` event. Whenever a route changes in our application, angular will emit a '$routeChangeStart' which will run our callback. The bigger picture here is that on every route change, we're going to check if that specific user should be seeing that new view.
```
  $rootScope.$on('THEEVENT', function(){
    //callback
  })
```
is how you tell angular to listen for certain events. So in side your .run block, tell angular to listen for the '$routeChangeStart' event and pass it a callback function with a 'event', 'next', and 'current' parameter. As you can imagine, 'event' is the event that's happening, 'next' is the route the application is going to, and 'current' is the current route the application is on.
4. Inside your callback, check to see if ```EnvironmentService.getUserName()''' returns a truthy value, if it doesn't that means the user hasn't been created - which means we need to redirect the user to the login page IE $location.path('/login'). If it does, set a property on $rootScope (for now) of username with the value being what getUserName returned.

## Step 4: Create a Thread Service and Use Firebase Refs

1. Create a ThreadService and put it the appropriate folder.
2. Create methods named ```getThreads``` and ```getThread``` to generate AngularFire references to all threads and any
individual thread. You'll need to inject ```EnvironmentService``` to get your Firebase url and you'll need to inject
```$firebase``` to generate Firebase references (heretofore referred to as "refs").

```
angular.module('rtfmApp')
  .service('ThreadService', function ThreadService(EnvironmentService, $firebase) {
    var firebaseUrl = EnvironmentService.getEnv().firebase;

    return {
      getThreads: function () {
        return $firebase(new Firebase(firebaseUrl + '/threads'));
      },

      getThread: function (threadId) {
        return $firebase(new Firebase(firebaseUrl + '/threads/' + threadId));
      }
    }
  });
```

3. Inject the ```threadsRef``` into the ```ThreadsCtrl``` using a ```resolve``` attribute in your router.

```
.when('/threads', {
  templateUrl: 'views/threads.html',
  controller: 'ThreadsCtrl',
  resolve: {
    threadsRef: function (ThreadService) {
      return ThreadService.getThreads();
    }
  }
})
```

4. Open up your ```ThreadsCtrl``` located in ```threads.js```. Add ```threadsRef``` to its injections and bind
```threads.$asArray()``` to scope.

```
// app/scripts/controllers/threads.js

'use strict';

angular.module('rtfmApp')
  .controller('ThreadsCtrl', function ($scope, threadsRef) {
    $scope.threads = threadsRef.$asArray();
  });

```

***Why $asArray()???***

If you [read the docs](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebase), you'll see
that AngularFire refs generated with ```$firebase``` are meant for certain kinds of low-level Firebase transactions.
You don't want to use raw AngularFire refs very often... you want to use ```$asArray()``` or ```$asObject()``` to
convert the ref into an AngularFire array or an AngularFire object. These "arrays" and objects are designed very
specifically to work with Angular views.

AngularFire "arrays" are not true JavaScript arrays (hence the quotation marks), but they are as close as you'll get to an
array with Firebase. Firebase doesn't support JavaScript arrays for some very fundamental reasons related to data
integrity... but AngularFire "arrays" provide functionality that is very similar to the JS arrays with which you are
familiar.

You'll use ```$asObject()``` when you want to interact with the individual keys of the Firebase ref like you would with
a JS object. For instance, a single thread would be treated as an object so that you could do things like this:

```
var thread = threadRef.$asObject();
thread.title = "This is a new thread";
thread.$save();
```

Notice that we you could set the object property ```thread.title``` just as you would any JS object.

### Step 5: Set up Threads view

1. Let's set up ```threads.html``` with a list of threads, an input and a button to create a new thread, and links to
each thread's unique page.

```
<div>
    <p>Threads</p>

    <form name="newThreadForm">
        <input type="text" ng-model="newThreadTitle" placeholder="New thread title..." required/>
        <button ng-disabled="newThreadForm.$invalid" ng-click="createThread(username, newThreadTitle)">Add Thread</button>
    </form>

    <ul>
        <li ng-repeat="thread in threads">
            <a ng-href="#/thread/{{thread.$id}}">
                <span>{{ thread.title }}</span>
                <span>(by {{ thread.username }})</span>
            </a>
        </li>
    </ul>
</div>
```

2. You'll need to create a function in your ```ThreadsCtrl``` named ```createThread```. This function must be attached
to ```$scope``` and should accept a username and a thread title as arguments. It will then use the AngularFire "array"
```$add``` function to add the new thread to the ```threads``` array. Once you get this working, you'll be able to
add threads in your view and watch them automatically add themselves to the threads list.

```
angular.module('rtfmApp')
  .controller('ThreadsCtrl', function ($scope, threadsRef) {

    $scope.threads = threadsRef.$asArray();

    $scope.threads.$loaded().then(function (threads) {
      console.log(threads);
    });

    $scope.createThread = function (username, title) {
      $scope.threads.$add({
        username: username,
        title: title
      });

    }

  });
```

### Step 6: Set Up Individual Thread Views

1. Create a ```ThreadCtrl``` and a ```thread.html```
2. Add the new controller and view to the ```thread``` route in ```app.js```. Also create a resolve for ```thread```
that uses ```$route.current.params.threadId``` and ```ThreadService.getThread()``` to inject each thread's AngularFire ref into
your new ```ThreadCtrl```.

```
.when('thread/:threadId', {
  templateUrl: 'views/thread.html',
  controller: 'ThreadCtrl',
  resolve: {
    threadRef: function (ThreadService, $route) {
      return ThreadService.getThread($route.current.params.threadId);
    }
  }
});
```

3. Inject ```threadRef``` into your ```ThreadCtrl``` and use AngularFire's ```$asObject``` and ```$bindTo``` methods
to bind the thread to ```$scope.thread```.

```
angular.module('rtfmApp')
  .controller('ThreadCtrl', function ($scope, threadRef) {
    var thread = threadRef.$asObject();

    thread.$bindTo($scope, 'thread');
  });

```

***Why $asObject and $bindTo???***

AngularFire refs can get converted into AngularFire "objects". These "objects" can be bound to ```$scope``` using
AngularFire's
[$bindTo](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebaseobject-bindto-scope-varname)
function. This sets up 3-way binding from your view, through ```$scope``` and all the way back to your Firebase
data store. You can edit these AngularFire "objects" in place in your view and watch the changes propagate throughout
your entire app.

4. Edit ```app/views/thread.html``` to create a inputs to add comments under the thread as well as read out all
existing comments.

```
<div>
    <h1>{{ thread.title }} (by {{ thread.username }})</h1>

    <form name="newCommentForm">
        <input type="text" ng-model="newCommentText" placeholder="Write a comment..." required/>
        <button ng-disabled="newCommentForm.$invalid" ng-click="createComment(username, newCommentText)">Add Comment</button>
    </form>

    <ul>
        <li ng-repeat="comment in comments">{{ comment.username }}: {{ comment.text }}</li>
    </ul>
</div>
```

Notice how we're looping through ```comment in comments```? We're going to want each thread to have an "array" of
comments in its Firebase data structure. We haven't created the ```comments``` "array" yet, but we can create an
AngularFire ref to it anyway. Firebase will treat that ref as if it already exists, so we can loop through it and add
to it seamlessly. This will require creating a new ```getComments``` method in ```ThreadService``` and injecting this
new ```commentsRef``` into ```ThreadCtrl``` using a ```resolve``` in your ```thread``` route.

This may seem like a lot of steps, but you've already gone through these steps twice with ```threadsRef``` and
```threadRef```. The new ```commentsRef``` follows the same pattern.

```
angular.module('rtfmApp')
  .service('ThreadService', function ThreadService(EnvironmentService, $firebase) {
    var firebaseUrl = EnvironmentService.getEnv().firebase;

    return {
      getThreads: function () {
        return $firebase(new Firebase(firebaseUrl + '/threads'));
      },

      getThread: function (threadId) {
        return $firebase(new Firebase(firebaseUrl + '/threads/' + threadId));
      },

      getComments: function (threadId) {
        return $firebase(new Firebase(firebaseUrl + '/threads/' + threadId + '/comments'));
      }
    }
  });

```

```
.when('/thread', {
  templateUrl: 'views/thread.html',
  controller: 'ThreadCtrl',
  resolve: {
    threadRef: function (ThreadService, $route) {
      return ThreadService.getThread($route.current.params.threadId);
    },
    commentsRef: function (ThreadService, $route) {
      return ThreadService.getComments($route.current.params.threadId);
    }
  }
})
```

```
angular.module('rtfmApp')
  .controller('ThreadCtrl', function ($scope, threadRef, commentsRef) {
    var thread = threadRef.$asObject();

    thread.$bindTo($scope, 'thread');

    $scope.comments = commentsRef.$asArray();

    $scope.createComment = function (username, text) {
      $scope.comments.$add({
        username: username,
        text: text
      });
    };
  });
```

Notice that we've added a new ```$scope.createComment``` function. This will get called from the ```thread.html``` view
and add a comment to your AngularFire ```comments``` "array".

## Black Diamond

This is the seed of a functioning Angular + Firebase application. You could really take it anywhere, but a great first
step would be to use
[FirebaseSimpleLogin](https://www.firebase.com/docs/web/libraries/angular/quickstart.html#section-authentication)
to create a real login system rather than the ```localStorage``` hack that we've used here.

You'll want to create users, get the logged in user and offer a "log out" button.

Check out this [example user-service](https://gist.github.com/deltaepsilon/3b1b5cbc7ee889b2378b) if you get stuck. It's
got some more advanced code that may look confusing at first, but read through each function and try to understand what
it's doing. If you can't understand the function, skip it and circle back later. The important functions in this example
are the simple ones.
