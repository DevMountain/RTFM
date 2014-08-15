RTFM
====

A project start for practicing using Firebase with AngularJS.

We're going to create a multi-user, real-time forum (RTFM).

## Step 1: Create project
1. Using Yeoman, create an Angular app. Don't check Sass, use Bootstrap, and don't use any of the Angular-generator
defaults.
2. Install your NPM dependencies ```npm install```.
3. Install firebase, angularfire and angular-ui-router using bower:
```bower install --save firebase angularfire angular-ui-router```. If Bower asks you to 'find a suitable version for
angular', pick the latest version of Angular and persist your selection with a ```!```.

```
Unable to find a suitable version for angular, please choose one:
    1) angular#1.2.6 which resolved to 1.2.6 and is required by angular-mocks#1.2.6, angular-scenario#1.2.6, rtfm
    2) angular#>= 1.0.8 which resolved to 1.2.6 and is required by angular-ui-router#0.2.10
    3) angular#1.2.21 which resolved to 1.2.21 and is required by angularfire#0.8.0

Prefix the choice with ! to persist it to bower.json


[?] Answer: 3!
```

4. Run ```grunt serve``` to make sure that your boilerplate install is working. You should see a Yeoman welcome page.

## Step 2: Configure Module

1. Open up ```app/scripts/app.js``` and add ```firebase``` and ```ui.router``` to your module dependencies.
2. Add a ```.config``` function and include ```$stateProvider``` and ```$urlRouterProvider``` to your injections.
3. Stub in routes for ```/login```, ```/threads``` and ```/threads/$threadId```.
4. Use ```$urlRouterProvider.otherwise()``` to configure a default URL.


```
/*
 * app.js
 */

'use strict';

angular.module('rtfmApp', ['firebase', 'ui.router']).config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('login', {
      url: '/login'
    })
    .state('threads', {
      url: '/threads'
    })
    .state('thread', {
      url: '/thread/$threadId'
    });
});

```

## Step 3: Create Login View

1. Open up ```index.html``` and switch Yeoman's default ```views/main.html``` view with a ```ui-view``` attribute.

***OLD***
```
<!-- Add your site or application content here -->
    <div class="container" ng-include="'views/main.html'" ng-controller="MainCtrl"></div>
```

***NEW***
```
<!-- Add your site or application content here -->
    <div class="container" ui-view></div>
```

2. Create a login view and a login controller using Yeoman.
```yo angular:view login```, ```yo angular:controller login```
3. Include your new view and controller in your ```login``` state.

```
$stateProvider
    .state('login', {
      url: '/login',
      templateUrl: '/views/login.html',
      controller: 'LoginCtrl'
    })
    ...
```

4. Make sure ```grunt serve``` is still running so that you can see your new view. The Yeoman boilerplate view should
be replaced with the text 'This is the login view.'

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

2. Import ```env.js``` in your ```index.html``` file so that ```window.env``` is created before the rest of your
JS files load.

```
<!--Environment vars attached to window.env-->
    <script src="env.js"></script>

<!-- build:js scripts/vendor.js -->
<!-- bower:js -->
  <script src="bower_components/jquery/jquery.js"></script>
  <script src="bower_components/angular/angular.js"></script>
  <script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
  <script src="bower_components/firebase/firebase.js"></script>
  <script src="bower_components/firebase-simple-login/firebase-simple-login.js"></script>
  <script src="bower_components/angularfire/dist/angularfire.min.js"></script>
  <script src="bower_components/angular-ui-router/release/angular-ui-router.js"></script>
<!-- endbower -->
<!-- endbuild -->
```

3. Create an EnvironmentService to make your environment variables injectable into any Angular module using yeoman:
```yo angular:service environment-service```

```
'use strict';

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

```
/*
 * Login.js
 */

'use strict';

angular.module('rtfmApp')
  .controller('LoginCtrl', function ($scope, EnvironmentService) {
    $scope.env = EnvironmentService.getEnv();
  });

```
/*
 * view/login.html
 */

 <p>This is the login view.</p>

 <div>
     {{ env }}
 </div>

```

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
4. Create another function in ```EnvironmentService``` called ```getUsername``` that returns the username with
```$window.localStorage.getItem('username');```.
5. Inject ```$state``` into ```LoginCtrl``` and use it to forward the user to the ```threads``` state after login.
6. Use Yeoman to create a ```views/threads.html``` view and a ```ThreadsCtrl``` controller. Add the new view and
controller to the ```threads``` state in ```app.js```.
7. Test your login and make sure that it forwards you to the stubbed threads view.


## Step 5: Create A Logged In Abstract State

You're going to want access to the uesrname through the logged-in sections of the app, and you're not going to want a
user to access the logged-in portions of the app without having a saved username.
An [abstract state](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#abstract-states)
is a quick and easy way to accomplish this.

1. Open ```app.js``` and create a new state, just after the ```login``` state. Call this state ```secure```.
It will be an abstract state with one resolved injection and one controller.
The injection will be called ```username``` and the controller will be ```SecureCtrl```.

```
/*
 * app/scripts/app.js
 */

 ...
.state('secure', {
      abstract: true,
      controller: 'SecureCtrl',
      resolve: {
        username: function (EnvironmentService) {
          return EnvironmentService.getUsername();
        }
      }
    })
...
```

2. Use Yeoman to create ```SecureCtrl```.
3. Open up ```app/scripts/controller/secure.js``` and inject ```username``` and ```$state``` into the ```SecureCtrl```.
4. If ```username``` is missing, use ```$state.go``` to redirect to the ```login``` state.
5. Assign ```username``` to ```$scope.username```.

```
/*
 * app/scripts/controllers/secure.js
 */

'use strict';

angular.module('rtfmApp')
  .controller('SecureCtrl', function ($scope, $state, username) {
    if (!username) {
      $state.go('login');
    }

    $scope.username = username;
  });
```

6. Open up ```app.js``` and make the ```threads``` route and the ```thread``` route child routes to ```secure```. Child
routes are only instantiated after all parent routes have resolved, and child routes have access to their parent's
scope, so we can now secure any route by making it a child to ```secure```.

```
...
.state('secure', {
      abstract: true,
      controller: 'SecureCtrl',
      resolve: {
        username: function (EnvironmentService) {
          return EnvironmentService.getUsername();
        }
      }
    })
    .state('secure.threads', {
      url: '/threads',
      templateUrl: 'views/threads.html',
      controller: 'ThreadsCtrl'
    })
    .state('secure.thread', {
      url: '/thread/$threadId'
    })
...
```

7. Open up ```threads.html``` and log out ```{{ username }}``` to make sure that the username has resolved correctly.
8. Notice that when you log in, you get a warning stating
```Error: Could not resolve 'threads' from state 'login'```. This is because your old ```threads``` view has
been replaced with ```secure.threads```, so open up ```login.js``` and fix your redirect to look like this:
```$state.go('secure.threads');```

## Step 4: Create a Thread Service

1. Use yeoman to create the ThreadService ```yo angular:service thread-service```.
2. Create methods to get all threads and get individual threads.

```

```

##Step 2: Create a Thread Controller
*NOTE:* Because there are some incompatibilities with angular-ui-router, Firebase, and Yeoman, we can't use the angular-ui-router in this project. 
* Let's add a 'ThreadCtrl' to this project using Yeoman and modify the app's main view, views/main.html so that the view is wrapped with our new Angular controller, ThreadCtrl.

##Step 3: Setup view
* Modify the views/main.html file to contain a header ("RTFM") and a "threads" div, with an ng-repeat that will display each thread.
* Add an input for creating a new thread, bind it to a scope variable such as 'newThreadTitle'
* Add a div for the replies for a given thread. 
* Below the replies div, add an input for creating a new reply. Bind the input to a scope variable such as 'newReply'

##Step 4: Setup Firebase and Threads
* In your ThreadCtrl, make sure you include Firebase as a dependency at the module level as well as the injection level for the controller. (Hint: see AngularFire documentation if you need a reminder).
* Create a reference to your Firebase app url, appended with '/threads'
* Set the scope.threads var to be equal to your Firebase reference (again, see docs to remember how to do this).
* Create a `addThread` function on your scope that will check for the Enter key being pressed (keyCode 13), and call the $add on your $scope.threads to add a new thread. It could look something like this:

```javascript
$scope.threads.$add({name: $scope.newThreadTitle});
```
Remember, newThreadTitle was the ng-model we bound to the input.
* Now use the ng-keydown method on your New Thread input and make sure you pass in the $event so you can check the keyCode.
* *NOTE*: very important! When you ng-repeat through the threads from the scope, you need to separate out the keys of the threads from the threads themselves. This looks a little tricky but is actually fairly simple:

```
<div ng-repeat="(id, thread) in threads">
```
What this allows you to do is capture both the unique Firebase id as well as the thread object to be used in the DOM.
* For each thread you display, add an ng-click that will set that thread to be the current thread, let's call the method 'changeThread' and pass in the id
* Make sure your threads display and that you can add a new thread

##Step 5: Changing threads, adding replies
* Let's make that 'changeThread' method on the scope in ThreadCtrl.
* Since the method is passed the thread's Firebase id, we just need to construct a new Firebase reference to that unique thread so we can access/modify its replies. This might look somethine like this:

```javascript
$scope.changeThread = function(id) {
      var threadRef = new Firebase('http://devmtn-rtfm.firebaseIO.com/threads/'+id);
      $scope.currentThread = $firebase(threadRef);
```
And now that we have the current thread, we also need to access the thread's child object, "replies."
* Use the Firebase ref's $child method to add a scope variable that points to the currentThread's replies (similar to the $add method you already used on $scope.threads).

```javascript
$scope.replies = $scope.currentThread.$child('replies');
```

* We've got our currentThread, now when the user types into the newReply input and presses enter, let's make a 'addReply' method that gets called (very similar to our addThread method) and uses $add to add the newReply onto the currentThread's replies.

##Step 6: Add some love
* Add some basic CSS so that this feels a little bit more like a forum. Feel free to go crazy here, but here's a working example: http://devmtn.s3-website-us-east-1.amazonaws.com/

##Step 7 (Black Diamond): Use [SimpleLogin](https://www.firebase.com/docs/angular/reference.html#firebasesimplelogin) to add authentication to RTFM
