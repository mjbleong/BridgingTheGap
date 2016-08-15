'use strict';

cs142App.controller('LoginRegisterController', ['$scope', '$routeParams', '$resource', '$http', '$rootScope', '$location', '$firebaseObject',
  function($scope, $routeParams, $resource, $http, $rootScope, $location, $firebaseObject) {

    $scope.main.title = 'Please Login';

    $scope.loginRegister = {};

    $scope.main.error = false;

    $scope.loginRegister.userId = "";
    $scope.loginRegister.pass = "";

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


    $scope.loginRegister.regError = false;
    $scope.loginRegister.emptyFields = false;
    $scope.loginRegister.first_name = "";
    $scope.loginRegister.user_email = "";
    $scope.loginRegister.last_name = "";
    $scope.loginRegister.location = "";
    $scope.loginRegister.description = "";
    $scope.loginRegister.occupation = "";
    $scope.loginRegister.password = "";
    $scope.loginRegister.confirmPassword = "";


    $scope.loginRegister.schools = [
      {name: "Overfelt"},
      {name: "Piedmont Hills"},
      {name: "Yerba Buena"}
    ];
    $scope.loginRegister.highSchool = "";

    $scope.loginRegister.gradYears = [
      {value: "2013"},
      {value: "2014"},
      {value: "2015"},
      {value: "2016"}
    ];
    $scope.loginRegister.gradYear = "";

    $scope.loginRegister.collegeGradYears = [
      {value: "2015"},
      {value: "2016"},
      {value: "2017"},
      {value: "2018"}
    ];
    $scope.loginRegister.collegeGradYear = "";

    $scope.loginRegister.collegeGrades = [
      {value: "Freshman"},
      {value: "Sophomore"},
      {value: "Junior"},
      {value: "Senior"}
    ];
    $scope.loginRegister.collegeGrade = "";

    $scope.loginRegister.collegeNames = [
      {value: "SJSU"},
      {value: "Santa Clara"},
      {value: "UC Berkeley"},
      {value: "DVC"}
    ];
    $scope.loginRegister.college = "";

    // $scope.loginRegister.selected = $scope.loginRegister.filter.fields[0].value;
    $scope.loginRegister.selected ="High Schoolyoo";
    $scope.loginRegister.letter = "hello";
    $scope.loginRegister.showRegistrationForm = false; //set back to false
    $scope.loginRegister.wrongPassword = false;



    // ------ Password Validation ------
    var validatePassword = function() {
      if ($scope.loginRegister.password != $scope.loginRegister.confirmPassword) {
        $scope.loginRegister.regError = true;
        return false;
      }
      return true;
    }

    var wrongPassword = function() {
      var password = document.getElementById("login-password");
      // password.setCustomValidity("Incorrect Password")
      $scope.loginRegister.wrongPassword = true;
      $scope.$apply();
    }


    $scope.main.login = function(email, password) {
      if(!validatePassword()) return;
      firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
        console.log("I HAVE LOGGED IN CALLBACK");
        var user = firebase.auth().currentUser;
        console.log(user);
        if (user) {
          $scope.main.loggedIn = true;
          $location.path("/alum");
          $scope.$apply()
        } else {
          $scope.main.loggedIn = false;
          $scope.main.error = true;
          console.log("Couldn't log in");
          $scope.main.loggedIn = false;
        }
      }).catch(function(error) { //incorrect password
        $scope.main.loggedIn = false;
        $scope.main.error = true;
        console.log(error);
        console.log("error");
        wrongPassword();
      });
    };


    $scope.clickFunc = function(event) {
      var modelObj = {
        login_name: $scope.userId,
        password: $scope.pass
      };
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

    $scope.loginRegister.registerClickFunc = function() {
      console.log("Trying to register");
      $scope.loginRegister.regError = false;
      if($scope.loginRegister.college === "" || $scope.loginRegister.gradYear === "" || $scope.loginRegister.collegeGrade === "" || $scope.loginRegister.collegeGradYear === "" || $scope.loginRegister.highSchool === "") {
        console.log("one field is blank");
        $scope.loginRegister.emptyFields = true;
        return;
      }
      if(!validatePassword()){
        console.log("password validation incorrect");
        return;
      } 

      //was trying to use AngularFire $createUserWithEmailAndPassword but for some reason it does not trigger the callback
      firebase.auth().createUserWithEmailAndPassword($scope.loginRegister.user_email, $scope.loginRegister.password).then(function(firebaseUser) {
        //create entry in Firebase
        console.log(firebaseUser.uid);

        var ref = firebase.database().ref('/users/' + firebaseUser.uid);
        var newUserObj = $firebaseObject(ref);
        newUserObj.firstname = $scope.loginRegister.first_name;
        newUserObj.lastname = $scope.loginRegister.last_name;
        newUserObj.email = $scope.loginRegister.user_email;
        newUserObj.college = $scope.loginRegister.college;
        newUserObj.collegegrad = $scope.loginRegister.collegeGradYear;
        newUserObj.collegeyear = $scope.loginRegister.collegeGrade;
        newUserObj.hsgrad = $scope.loginRegister.gradYear;
        newUserObj.hs = $scope.loginRegister.highSchool;
        newUserObj.$save().then(function(ref) {
          $location.path('/completeRegistration');
        }, function(error) {
          console.log(error);
        });

      });
    };

  }
]);