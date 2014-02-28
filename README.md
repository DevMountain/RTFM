RTFM
====

A project start for practicing using Firebase with AngularJS.

We're going to create a multi-user, real-time forum (RTFM).

##Step 1: Create project
* Using Yeoman, create an Angular app. Don't check Sass, use Bootstrap, and don't use any of the Angular-generator defaults.
* Using bower, install firebase (and save it as a dependency)
* Manually include a link to angularfire in your index.html (link here: https://cdn.firebase.com/libs/angularfire/0.7.0/angularfire.min.js). Make sure you include it *after* the Angular and Firebase includes, but *before* your own Angular script files.

##Step 2: Create a Thread Controller
Because there are some incompatibilities with angular-ui-router, Firebase, and Yeoman, we can't use the angular-ui-router in this project. 
* Let's add a 'ThreadCtrl' to this project using Yeoman and modify the app's index.html so that the default Angular controller is the ThreadCtrl.
* Modify the views/main.html file to contain a header ("RTFM") and a "threads" div, with an ng-repeat that will display each thread.

##Step 3: Include Firebase and connect within the ThreadCtrl

##Step 4: Add a way to create a new thread

##Step 5: Add a way to create new replies to threads
