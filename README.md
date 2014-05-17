RTFM
====

A project start for practicing using Firebase with AngularJS.

We're going to create a multi-user, real-time forum (RTFM).

##Step 1: Create project
* Using Yeoman, create an Angular app. Don't check Sass, use Bootstrap, and don't use any of the Angular-generator defaults.
* Using bower, install firebase (and save it as a dependency)
* Manually include a link to angularfire in your index.html (link here: https://cdn.firebase.com/libs/angularfire/0.7.0/angularfire.min.js). Make sure you include it *after* the Angular and Firebase includes, but *before* your own Angular script files.

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
