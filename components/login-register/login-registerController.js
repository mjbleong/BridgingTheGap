'use strict';

cs142App.controller('LoginRegisterController', ['$scope', '$routeParams', '$resource', '$http', '$rootScope','$location',
  function ($scope, $routeParams, $resource, $http, $rootScope, $location) {

    $scope.main.title = 'Please Login';

    $scope.login = {};
    $scope.main.error = false;

    $scope.userId = "";
    $scope.pass = "";

    $scope.login_name = "";
    $scope.first_name = "";
    $scope.last_name = "";
    $scope.location = "";
    $scope.description = "";
    $scope.occupation = "";
    $scope.password = "";
    $scope.confirmPassword = "";

    $scope.retrievePassword = function() {
      firebase.auth().sendPasswordResetEmail($scope.userId).then(function () {
        console.log('reset password email sent');
      }, function(error) {
        if (error.code === 'auth/invalid-email') {
          console.log('invalid email error');
        }
        if (error.code === 'auth/user-not-found') {
          console.log('that is not a user');
        }
      });
    };

    $scope.main.login = function(email, password) {
      firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
        // $scope.main.error = true; // basically a hack for now
        var user = firebase.auth().currentUser;
        console.log(user);
        if(user) {
          $scope.main.loggedIn = true;
          $location.path("/alum");
          $scope.$apply()
        } else {
          $scope.main.loggedIn = false;
          $scope.main.error = true;
          console.log("Couldn't log in");
          $scope.main.loggedIn = false;
        }
      }).catch(function(error) {
        $scope.main.loggedIn = false;
        $scope.main.error = true;
        console.log("error");
      });
    };


    $scope.clickFunc = function(event) {
      var modelObj = {login_name : $scope.userId, password: $scope.pass};
      $scope.main.error = null;
      var login = $resource('/admin/login');
        login.save(modelObj, function(user) {
          var currLoginFullName = user.first_name + " " + user.last_name;
          $scope.main.title = 'Hello ' + currLoginFullName;
          $scope.main.error = false;
          var sessionSet = $resource('/getSession');
          sessionSet.get({}, function(session) {
            $scope.main.loggedIn = session.login_name;
            console.log(session.login_name);
            $location.path("/users/" + session.my_id);
            $scope.main.hello = "Hello " + user.first_name + ", ";
           
          });
        
        }, function errorHandling(err) { 
          $scope.main.title = "Username not found, please try again";
          $scope.main.error = true;
      });

};

    $scope.registerClickFunc = function(event) {
      $scope.main.regError = null;

      if ($scope.login_name === null ||$scope.first_name === null || $scope.last_name === null || $scope.location ===  null || $scope.description === null || $scope.occupation === null || $scope.password === null || $scope.confirmPassword === null) {
        $scope.main.regError = true;
        return;
    }
    if ($scope.password !== $scope.confirmPassword) {
              $scope.main.regError = true;
              return;
    }
    var timestamp = new Date().valueOf();

    var id = 'U' +  String(timestamp) + $scope.login_name;

    var modelObj = {login_name: $scope.login_name,
    first_name: $scope.first_name,
    last_name: $scope.last_name,
    location: $scope.location,
    description: $scope.description,
    occupation: $scope.occupation,
    password: $scope.password,
    confirmPassword: $scope.confirmPassword,
    id: id};

    var register = $resource('/user');
      register.save(modelObj, function(user) {
        var currLoginFullName = user.first_name + " " + user.last_name;
        $scope.main.title = 'Hello ' + currLoginFullName;
        $scope.main.regError = false;
        var sessionSet = $resource('/getSession');
        sessionSet.get({}, function(session) {
          $scope.main.loggedIn = session.login_name;
          console.log(session.login_name);
          $location.path("/users/" + session.my_id);
          $scope.main.hello = "Hello " + user.first_name + ", ";

         
      });

      }, function errorHandling(err) { 
        $scope.main.title = "Error registering, please try again.";
        $scope.main.regError = true;
    });

};

  }]);
