RTFM
====

In this project, you'll get comfortable with hooking Firebase to your Angular application in order to persist your data.

We're going to create a multi-user, real-time forum (RTFM).

## Step 1: Create Project
- Create the basic structure of your Angular application naming your app 'rtfmApp'.
- After you include Angular, include firebase, angularfire, and ngRoute as scripts in your html file (Google them), then the rest of your basic angular files.


## Step 2: Configure Module
- In your app.js file include ```firebase``` and ```ngRoute``` to your module's dependencies.
- Add a ```.config``` function and include ```$routeProvider``` to your injections.
- Create a router and add ```/login```, ```/threads``` and ```/threads/:threadId``` as the URLS.
- Use ```.otherwise``` to ```redirectTo``` ```/login```.
- In your index.html file, include your ng-view attribute/element in order to tie in your router. *Should look like this below*.

```
  <div class="container" ng-view></div>
```

## Step 3: Create Login Skeleton

*Note: In today's project we'll ignore authentication, but tomorrow we'll make it so users need to log in to see certain routes/data and we'll persist that user state with Firebase. But for now, we'll just set up the basic structure for that in order to build on top of this functionality tomorrow.*

- Create a "login" folder and inside that folder create a login view (login.html) and a login controller (loginCtrl.js)

- Now, head over to your ```app.js``` file and include your new view and controller in your ```login``` route.

- Inside ```login.html``` create a text input bound to ```$scope.username``` (using ```ng-model```) and a button that calls ```logMeIn()``` when clicked.

- Now head over to your ```loginCtrl.js``` file and create the ```logMeIn``` function which (for now) will just alert ```$scope.username```.

## Step 4: Create a Constant with your Firebase URL

Firebase is very dependent upon URLs, meaning, if you want to set data, get data, remove data, etc, you'll do that based on your Firebase URL. Because of this, it's important that we're able to access our Firebase URL from anywhere. To accomplish this, we'll add a ```constant``` to our Angular app. A ```constant``` is a very common thing in Software Development. It allows us to set a value that won't change.

- Head over to your ```app.js``` file or wherever you're initiating your new app and right about your ```.config``` method, add a ```.constant``` method with the first argument being "fb" (which is the name of the constant) and the second argument being an object with a key of "url" whose value is "https://rtfm-demo.firebaseio.com/YOUR-GITHUBUSERNAME-HERE".

You can think of this ```fb``` constant as any other service. We're now able to inject ```fb``` anywhere we need it and grab the ```url``` property off of it in order to get our Firebase URL.

*I recommend instead of using the rtfm-demo project, you go and create your own Firebase project so you can see and handle the data yourself. To do so, head to Firebase.com and sign up. Once you do that you'll have the option to create a new project. Once you do that, copy the URL it gives you and replace the rtfm-demo URL above with your new URL.*

```
.constant('fb', {
  url: 'https://your-firebase-project'
});
```

## Step 5: User Service

We'll create a User Service which will manage the state of our user. Again, we won't worry too much about Authentication today, but tomorrow it will be nice to have these things built.

- In the appropriate place, create a file called userService.js.

- In your userService.js file, create a Service called ```userService```.

- Inject your ```fb``` constant into your userService so you can get your Firebase URL.

- Create a local variable called ```user``` which equals an empty object.

- Create a ```login``` method on your serive (```this```) which takes in a username, and for now, console.logs that username.

- Create a ```getUser``` method on your service (```this```) which, for now, just returns the local ```user``` variable you create earlier.

*Tomorrow we'll make it so this Service actually manages a user using Firebase*.

## Step 6: Reroute After Login

We eventually want to make it so that when a user logs in, if the login is successful, we'll reroute the user to the ```threads``` route (which we'll make in a bit).

- Inject ```$location``` into ```LoginCtrl``` and use it to forward the user to the ```threads``` route after login (which is /threads as the URL, hint, look up how to use $location to redirect to a different URL).

Here's an example of how to do that. You'll need to change the code to work for your use case.

```
$scope.$apply(function(){
	$location.path('/dashboard/' + user.uid)
});
```

## Step 7: Create your Threads Assets

Now we need to actually create our Thread view and controller.

- Create a ```threads.html``` view and a ```ThreadsCtrl.js``` controller in the appropriate folder. Add the new view and controller to the ```threads``` route in ```app.js```.

- Test your login and make sure that it forwards you to the stubbed threads view that we just built.

Tomorrow we'll add an 'event listener' which listens for anytime out app wants to changes routes. When it changes a route, it will go to the UserService we built and see if that user is logged in. If the user is logged in, we'll continue to the threads view. If the user is not logged in, we'll redirect the user to the Login view.

## Step 8: Create a Thread Service and Use Firebase Refs

- Create a threadService and put it in the appropriate folder.

- On that threadService create methods (on ```this```) named ```getThreads``` and ```getThread```.

- Inject your ```fb``` constant to get your Firebase url.

In order to create a reference to your Firebase (which will allow us to get, delete, add, and update data in our firebase database), we'll need to create a new instance of Firebase passing in the URL to our app.

For example, if my base url was "https://tylers-cool-app.firebaseio.com" then I would do

```var firebaseRef = new Firebase("https://tylers-cool-app.firebaseio.com");``` to create that reference. Now on firebaseRef, I can do a bunch of fancy things in order to manipulate my data that lives on my Firebase.

- Inside of your ```getThreads``` method, return a new instance of Firebase passing in your base url you get from the ```fb``` constants service you set up earlier + '/threads'.

Because that was wordy...that method should look like this

```
this.getThreads = function(){
  return new Firebase(fb.url);
}
```

- Now, have the other method (```getThread```) take in a ```threadId``` as its only parameter and return a new instance of Firebase passing in base URL + ```/threads/``` + ```threadId```.


## Step 9: Resolve the Firebase Data for your Controllers

Now that your threadsService is set up, we're going to use Resolve in our routes in order to make sure the data in our Firebase is ready for us when our controller loads.

- Head over to your ```app.js``` file and in the ```.threads``` route, add a resolve property on the object whose value s another object which has a property of theadsRef whose value is a function. That function is going to take in the ```threadService``` we just built and it's going to return ```ThreadService.getThreads()```.

Now since we're using resolve, ```threadRef``` will be available in our controller if we inject it in and its value will be the data which is coming from our getThreads() method.

- Open up your ```ThreadsCtrl.js``` Add pass in ```threadsRef``` to the ThreadsCtrl controller as well as ```$firebaseArray```.

- Set a property on the $scope object called ```threads``` which is set to ```$firebaseArray(threadsRef)```.

Remember, threadsRef is the result of calling ```getThreads``` which just returns us ```new Firebase('THE FIREBASE URL' + /thread)``` and ```$firebaseArray``` just makes it so it gives our data back to us as an Array.

```
// app/scripts/controllers/ThreadsCtrl.js

angular.module('rtfmApp')
  .controller('ThreadsCtrl', function ($scope, threadsRef, $firebaseArray) {
    $scope.threads = $firebaseArray(threadsRef)
  });

```

### Step 10: Set up Threads view

- Let's set up ```threads.html``` with a list of threads, an input and a button to create a new thread, and links to each thread's unique page.

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

- You'll need to create a function in your ```ThreadsCtrl``` named ```createThread```. This function must be attached to ```$scope``` and should accept a username and a thread title as arguments. It will then use the AngularFire "array" ```$add``` function to add the new thread to the ```threads``` array. Once you get this working, you'll be able to add threads in your view and watch them automatically add themselves to the threads list.
```
angular.module('rtfmApp')
  .controller('ThreadsCtrl', function ($scope, threadsRef) {

    $scope.threads = $firebaseArray(threadsRef)

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

### Step 11: Set Up Individual Thread Views

- Create a ```ThreadCtrl``` and a ```thread.html```
- Add the new controller and view to the ```thread``` route in ```app.js```. Also create a resolve for ```thread```
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

- Inject ```threadRef``` into your ```ThreadCtrl``` and use AngularFire's ```$firebaseObject``` and ```$bindTo``` methods to bind the thread to ```$scope.thread```.

```
angular.module('rtfmApp')
  .controller('ThreadCtrl', function ($scope, threadRef, $firebaseObject) {
    var thread = $firebaseObject(threadRef);

    thread.$bindTo($scope, 'thread');
  });

```

***Why $firebaseObject and $bindTo???***

AngularFire refs can get converted into AngularFire "objects". These "objects" can be bound to ```$scope``` using
AngularFire's [$bindTo](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebaseobject-bindto-scope-varname) function. This sets up 3-way binding from your view, through ```$scope``` and all the way back to your Firebase data store. You can edit these AngularFire "objects" in place in your view and watch the changes propagate throughout your entire app.

- Edit ```app/views/thread.html``` to create a inputs to add comments under the thread as well as read out all
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
AngularFire ref to it anyway. Firebase will treat that ref as if it already exists, so we can loop through it and add to it seamlessly. This will require creating a new ```getComments``` method in ```ThreadService``` and injecting this new ```commentsRef``` into ```ThreadCtrl``` using a ```resolve``` in your ```thread``` route.

This may seem like a lot of steps, but you've already gone through these steps twice with ```threadsRef``` and
```threadRef```. The new ```commentsRef``` follows the same pattern.

- In your ```threadService``` create a getComments method which takes in a ```threadId``` and returns a new Firebase instance passing in the base url + '/threads/' + threadId + '/comments'.

```
  getComments: function (threadId) {
    return $firebase(new Firebase(firebaseUrl + '/threads/' + threadId + '/comments'));
  }
```

- In your ```app.js``` file under your ```/thread``` route under resolve, add a ```commentsRef``` method which takes in ```threadService``` as well as ```$route``` and return the invocation of ```threadService.getComments($route.current.params.threadId)```.

It should look like this,

```
  commentsRef: function (ThreadService, $route) {
    return ThreadService.getComments($route.current.params.threadId);
  }
```

- Now in your ```ThreadCtrl``` inject ```commentsRef``` as well as ```$firebaseObject``` and on the $scope object set a ```comments``` property equal to the invocation of $firebaseObject passing in ```commentsRef```.

- Now add your ```createComment``` method to the $scope object. This method should take in a username and a text and then invoke the $add property on ```$scope.comments``` passing it an object with a key of username and the value being the username you passed in as well as a key of text and a value being the text you passed in. The final ```ThreadCtrl``` should look like this,

```
.controller('ThreadCtrl', function ($scope, threadRef, commentsRef, $firebaseObject, $firebaseArray) {
    var thread = $firebaseObject(threadRef)

    thread.$bindTo($scope, 'thread');

    $scope.comments = $firebaseArray(commentsRef);

    $scope.createComment = function (username, text) {
      $scope.comments.$add({
        username: username,
        text: text
      });
    };
  });
```

Notice that we've added a new ```$scope.createComment``` function. This will get called from the ```thread.html``` view and adds a comment to your AngularFire ```comments``` "array".