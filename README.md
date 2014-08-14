RTFM
====

A project start for practicing using Firebase with AngularJS.

We're going to create a multi-user, real-time forum (RTFM).

## Step 1: Create project
1. Using Yeoman, create an Angular app. Don't check Sass, use Bootstrap, and don't use any of the Angular-generator
defaults.
2. Install firebase, angularfire and angular-ui-router using bower:
```bower install --save firebase angularfire angular ui-router```.

## Step 2: Configure Module

1. Add ```firebase``` and ```ui.router``` to your module dependencies.
2. Add ```$stateProvider``` and ```$urlRouterProvider``` to your module's injections.
3. Stub in routes for ```/threads``` and ```/threads/$threadId```.
4. Use ```$urlRouterProvider.otherwise()``` to configure a default URL.



```
/*
 * app.js
 */

'use strict';

angular
  .module('rtfmApp', ['firebase', 'ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/threads');

    $stateProvider
      .state('threads', {
        url: '/threads'
      })
      .state('thread', {
        url: '/thread/$threadId'
      });

  });
```

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
<script src="lib/modernizr/modernizr.js"></script>
<script src="lib/jquery/dist/jquery.js"></script>
<script src="lib/angular/angular.js"></script>
<script src="lib/angular-ui-router/release/angular-ui-router.js"></script>
<script src="lib/firebase/firebase.js"></script>
<script src="lib/angularfire/dist/angularfire.min.js"></script>
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
