<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250" align="right">

RTFM
====

##Objective
Use Firebase and Angular to persist data into a web application that acts like a real-time forum

In this project, you'll get comfortable with hooking Firebase to your Angular application in order to persist your data.

We're going to create a multi-user, real-time forum (RTFM).

![alt text](https://github.com/DevMountain/RTFM/blob/master/preview.png?raw=true,"Forum example")

## Step 1: Create Project
- Create the basic structure of your Angular application naming your app 'rtfmApp'.
- After you include Angular, include firebase, angularfire, and ui-router as scripts in your html file (Google them), then the rest of your basic angular files.


## Step 2: Configure the Module
- In your app.js file include `firebase` and `ui.router` to your module's dependencies.
- Add a `.config` function and include `$stateProvider` and `$urlRouterProvider` to your injections.
- Create a router and add `/threads` and `/threads/:threadId` as the URLS.
- Use `.$urlRouterProvider.otherwise` to redirect any other url to `/threads`.
- In your index.html file, include your ui-view attribute/element in order to tie in your router. *Should look like this below*.

```html
  <div class="container" ui-view></div>
```

*Note: In today's project we'll ignore authentication, but tomorrow we'll make it so users need to log in to see certain routes/data and we'll persist that user state with Firebase. But for now, we'll just set up the basic structure for that in order to build on top of this functionality tomorrow.*


## Step 3: Create a Constant with your Firebase URL

Firebase is very dependent upon URLs, meaning, if you want to set data, get data, remove data, etc, you'll do that based on a Firebase URL. Because of this, it's important that we're able to access our Firebase URL from anywhere. To accomplish this, we'll add a `constant` to our Angular app. A `constant` is a very common thing in Software Development. It allows us to set a value that won't change.

- Head over to your `app.js` file or wherever you're initiating your new app and right above your `.config` method, add a `.constant` method with the first argument being "fb" (which is the name of the constant) and the second argument being an object with a key of "url" whose value is "https://[your-firebase-app-name-here].firebaseio.com/".

You can think of this `fb` constant as any other service. We're now able to inject `fb` anywhere we need it and grab the `url` property off of it in order to get our Firebase URL.

*Go and create your own Firebase project so you can see and handle the data yourself. To do so, head to Firebase.com and sign up. Once you do that you'll have the option to create a new project. Once you do that, copy the URL it gives you and use your Firebase app's URL with the constant call.*

```javascript
.constant('fb', {
  url: 'https://[your-firebase-app-name-here].firebaseio.com/'
});
```


## Step 4: Create your Threads Assets

Now we need to actually create our Threads view and controller.

- Create a `threads.html` view and a `threadsCtrl.js` controller in the appropriate folders. Add the new view and controller to the `/threads` route in `app.js`.


## Step 5: Create a Thread Service and Use Firebase Refs

- Create a threadService and put it in the appropriate folder.

- On that threadService create methods (on `this`) named `getThreads` and `getThread`.

- Inject your `fb` constant to get your Firebase url.

In order to create a reference to your Firebase (which will allow us to get, delete, add, and update data in our firebase database), we'll need to create a new instance of Firebase passing in the URL to our app.

For example, if my base url was "https://my-cool-app.firebaseio.com/" then I would do

`var firebaseRef = new Firebase("https://my-cool-app.firebaseio.com/");` to create that reference. Now on firebaseRef, I can do a bunch of fancy things in order to manipulate my data that lives on my Firebase.

- Inside of your `getThreads` method, return a new instance of Firebase passing in your base url you get from the `fb` constants service you set up earlier + '/threads'.

That method should look like this

```javascript
this.getThreads = function(){
  return new Firebase(fb.url + '/threads');
}
```

- Now, have the other method (`getThread`) take in a `threadId` as its only parameter and return a new instance of Firebase passing in base URL + `/threads/` + `threadId`.


## Step 6: Resolve the Firebase Data for your Controllers

Now that your threadService is set up, we're going to use `resolve` in our routes in order to make sure the data in our Firebase is ready for us when our controller loads.

- Head over to your `app.js` file and in the `/threads` route, add a resolve property on the object whose value is another object which has a property of theadsRef whose value is a function. That function is going to take in the `threadService` we just built and it's going to return `threadService.getThreads()`.

Now since we're using resolve, `threadsRef` will be available in our controller if we inject it in and its value will be the data which is coming from our getThreads() method.

- Open up your `threadsCtrl.js` Add pass in `threadsRef` to the threadsCtrl controller, as well as `$firebaseArray`.

- Set a property on the $scope object called `threads` which is set to `$firebaseArray(threadsRef)`.

Remember, threadsRef is the result of calling `getThreads` which just returns us `new Firebase('THE FIREBASE URL' + /thread)` and `$firebaseArray` just makes it so it gives our data back to us as an Array.

```javascript
angular.module('rtfmApp')
  .controller('threadsCtrl', function ($scope, threadsRef, $firebaseArray) {
    $scope.threads = $firebaseArray(threadsRef)
  });
```

### Step 7: Set up Threads view

- Let's set up `threads.html` with a list of threads, an input and a button to create a new thread, and links to each thread's unique page.

```html
<div>
    <p>Threads</p>

    <form name="newThreadForm">
        <input type="text" ng-model="newThreadTitle" placeholder="New thread title..." required/>
        <input type="text" ng-model="username" placeholder="Username..." required/>
        <button ng-disabled="newThreadForm.$invalid" ng-click="createThread(username, newThreadTitle)">Add Thread</button>
    </form>

    <ul>
        <li ng-repeat="thread in threads">
            <a ui-sref="thread({threadId: thread.$id})">
                <span>{{ thread.title }}</span>
                <span>(by {{ thread.username }})</span>
            </a>
        </li>
    </ul>
</div>
```

- You'll need to create a function in your `threadsCtrl` named `createThread`. This function must be attached to `$scope` and should accept a username and a thread title as arguments. It will then use the AngularFire "array" `$add` function to add the new thread to the `threads` array. Once you get this working, you'll be able to add threads in your view and watch them automatically add themselves to the threads list.

```javascript
angular.module('rtfmApp')
  .controller('threadsCtrl', function ($scope, threadsRef) {

    $scope.threads = $firebaseArray(threadsRef)

    $scope.threads.$loaded().then(function (threads) {
      console.log(threads);
    });

    $scope.createThread = function (username, title) {
      $scope.threads.$add({
        username: username,
        title: title
      });

    };

  });
```

If you've done everything correctly, you should be able to load your page using a local server (e.g. http-server) and see the list of threads. Try to add some from your Firebase app's web console (open the URL in your browser), or add some from your app directly with the HTML provided.

### Step 8: Set Up Individual Thread Views

- Create a `threadCtrl` and a `thread.html`
- Add the new controller and view to the `/threads/:threadId` route in `app.js`. Also create a resolve for `thread`
that uses `$stateParams.threadId` and `threadService.getThread()` to inject each thread's AngularFire ref into
your new `threadCtrl`.

```javascript
.state('thread', {
    url: '/threads/:threadId',
    templateUrl: 'path/to/thread.html',
    controller: 'threadCtrl',
    resolve: {
        threadRef: function (threadService, $stateParams) {
            return threadService.getThread($stateParams.threadId);
        }
    }
});
```

- Inject `threadRef` into your `threadCtrl` and use AngularFire's `$firebaseObject` and `$bindTo` methods to bind the thread to `$scope.thread`.

```javascript
angular.module('rtfmApp')
  .controller('threadCtrl', function ($scope, threadRef, $firebaseObject) {

    var thread = $firebaseObject(threadRef);
    thread.$bindTo($scope, 'thread');
  });
```

***Why $firebaseObject and $bindTo???***

AngularFire refs can get converted into AngularFire "objects". These "objects" can be bound to `$scope` using
AngularFire's [$bindTo](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebaseobject-bindto-scope-varname) function. This sets up 3-way binding from your view, through `$scope` and all the way back to your Firebase data store. You can edit these AngularFire "objects" in place in your view and watch the changes propagate throughout your entire app.

- Edit your thread template to create inputs to add comments under the thread as well as read out all existing comments.

```html
<div>
    <h1>{{ thread.title }} (by {{ thread.username }})</h1>

    <form name="newCommentForm">
        <input type="text" ng-model="newCommentText" placeholder="Write a comment..." required/>
        <input type="text" ng-model="username" placeholder="Username..." required/>
        <button ng-disabled="newCommentForm.$invalid" ng-click="createComment(username, newCommentText)">Add Comment</button>
    </form>

    <ul>
        <li ng-repeat="comment in comments">{{ comment.username }}: {{ comment.text }}</li>
    </ul>
</div>
```

Notice how we're looping through `comment in comments`? We're going to want each thread to have an "array" of
comments in its Firebase data structure. We haven't created the `comments` "array" yet, but we can create an
AngularFire ref to it anyway. Firebase will treat that ref as if it already exists, so we can loop through it and add to it seamlessly. This will require creating a new `getComments` method in `threadService` and injecting this new `commentsRef` into `threadCtrl` using a `resolve` in your `thread` route.

This may seem like a lot of steps, but you've already gone through these steps twice with `threadsRef` and
`threadRef`. The new `commentsRef` follows the same pattern.

- In your `threadService` create a getComments method which takes in a `threadId` and returns a new Firebase instance passing in the base url + '/threads/' + threadId + '/comments'.

```javascript
  this.getComments = function (threadId) {
    return new Firebase(fb.url + '/threads/' + threadId + '/comments');
  }
```

- In your `app.js` file under your `/threads/:threadId` route under resolve, add a `commentsRef` key whose function takes in `threadService` as well as `$stateParams` and return the invocation of `threadService.getComments($stateParams.threadId)`.

It should look like this,

```javascript
  commentsRef: function (threadService, $stateParams) {
    return threadService.getComments($stateParams.threadId);
  }
```

- Now in your `threadCtrl` inject `commentsRef` as well as `$firebaseArray` and on the $scope object set a `comments` property equal to the invocation of $firebaseArray passing in `commentsRef`.

- Now add your `createComment` method to the $scope object. This method should take in a username and a text and then invoke the $add property on `$scope.comments` passing it an object with a key of username and the value being the username you passed in as well as a key of text and a value being the text you passed in. The final `threadCtrl` should look like this,

```javascript
.controller('threadCtrl', function ($scope, threadRef, commentsRef, $firebaseObject, $firebaseArray) {

    var thread = $firebaseObject(threadRef);

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

Notice that we've added a new `$scope.createComment` function. This will get called from the `thread.html` view and adds a comment to your AngularFire `comments` "array".

At this point, you should be able to see a list of threads on the main `/threads` route. You should also be able to add a new thread, as well as click on any of the threads to drill down and see and add comments. All in real-time!

# Day Two: Authentication

We're going to add Firebase's authentication to our app. Buckle up.

## Step 1: Prepare the app
You need to go to your Firebase app and enable authentication. For this app we're going to enable email/password authentication. Head over to your Firebase dashboard and configure the email/password authentication piece.

Once that's finished, add these additional routes to your app:

### Login
State: login
Url: '/login'
controller: 'loginCtrl'
templateUrl: 'login.html'

### Signup
State: signup
Url: '/signup'
controller: 'signupCtrl'
templateUrl: 'signup.html'

## Step 2: Create and set up the userService
We're going to utilize a service to manage our authentication for us. Create a userService and add the following methods:

- `getUser` (returns the `$getAuth()` result)
- `register` (returns the `$createUser(newUser)` result)
- `login` (returns the `authWithPassword(user)` result)

Above your service methods, create an authRef (using `Firebase`) and an auth object (using `$firebaseAuth`). This should look something like this:

```javascript
var authRef = new Firebase(firebaseUrl.url);
var auth = $firebaseAuth(authRef);
```

## Step 3: Wire up the `login` and `signup` states
In your signup controller, create a `$scope.register` method that calls the userService's `register` method. You'll need to pass in the new user object (including email and password) into this method. Be sure you have the inputs and ng-models necessary in your view to accomplish this.

In the login controller, create a `$scope.login` method that calls the userService's `login` method. You'll need to pass in the user object (including email and password) from the view into this method. Be sure you have the inputs and ng-models necessary in your view to accomplish this. If the login succeeds, call `$state.go` to redirect the user to the threads page.

## Step 4 (going further): Handle logging out

We're going to use a nifty ability in routing to create a `logout` app.

```javascript
.state('logout', {
	url: '/logout',
	controller: function(UserService) {
		return userService.logout();
	},
})
```
See what we're doing? The only purpose of this route state is to call the `userService.logout` method.

```javascript
this.logout = function(user) {
	return auth.$unauth();
}
```

You're also going to want to watch the `$onAuth` in the userService so we can send the user to the correct view when they're not logged in.

```javascript
auth.$onAuth(function(authData) {
	if (!authData) {
		$state.go('login')
	}
});
```

If you want another challenge, create a "logout" directive that checks the userService for the user's auth status and shows a `Log out` link if appropriate.  This directive could be placed anywhere in your app and would allow the user to see their current state and log out.

## Contributions

If you see a problem or a typo, please fork, make the necessary changes, and create a pull request so we can review your changes and merge them into the master repo and branch.

## Copyright

© DevMountain LLC, 2017. Unauthorized use and/or duplication of this material without express and written permission from DevMountain, LLC is strictly prohibited. Excerpts and links may be used, provided that full and clear credit is given to DevMountain with appropriate and specific direction to the original content.

<p align="center">
<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250">
</p>

