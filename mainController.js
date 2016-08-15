'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial','ngResource', 'firebase', 'youtube-embed','ui.router', 'ui.router.router', 'ngCookies', 'webcam']);

cs142App.config(
    function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/login-register");
      // Now set up the states
      $stateProvider
        .state('buttons', {
          url: "/buttons",
          templateUrl: "production/admin-angular/buttons.html",
          controller: 'buttonsController'
        })
        .state('login-register', {
          url: "/login-register",
          templateUrl: 'components/login-register/login-registerTemplate.html',
          controller: 'LoginRegisterController'
        })
        .state('myProfile', {
          url: "/myProfile",
          templateUrl: 'components/profile/profileTemplate.html',
          controller: 'ProfileController'
        })
        .state('viewProfile', {
          url: "/viewProfile/:userID",
          templateUrl: 'components/view-profile/viewProfileTemplate.html',
          controller: 'ViewProfileController'
        })
        .state('upload', {
          url: "/upload-video",
          templateUrl: 'components/upload-video/uploadVideo.html',
          controller: 'UploadVideoController'
        })
        .state('alum', {
          url: "/alum",
          templateUrl: 'components/allAlum/allAlumTemplate.html',
          controller: 'AlumController'
        })
        .state('completeRegistration', {
          url: "/completeRegistration",
          templateUrl: 'components/complete-registration/complete-registrationTemplate.html',
          controller: 'CompleteRegistrationController'
        })
        // .state('alum.list', {
        //   url: "/list",
        //   templateUrl: "components/allAlum/profile-view.html"
        // })
        // .state('alum.topic', {
        //   url: "/topic",
        //   templateUrl: "components/allAlum/topic-view.html"
        // })
        // .state('alum.allvids', {
        //   url: "/allvids/:page",
        //   templateUrl: "components/allAlum/all-vids-view.html",
        //   controller: 'AlumController'
        // })
        
    ;
      });

cs142App.directive('elastic', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function() {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        };
    }
]);


cs142App.controller('MainController', ['$scope', '$resource', '$rootScope', '$location', '$http', '$route', "$firebaseAuth", '$cookies', '$firebaseObject', '$state',
    function ($scope, $resource, $rootScope, $location, $http, $route, $firebaseAuth, $cookies, $firebaseObject, $state) {

        $scope.main = {};
        $scope.authObj = $firebaseAuth();
        $scope.main.addPhotoButton = false;
        $scope.main.hello = null;
        $scope.main.loggedIn = false;
        $scope.main.firstTime = false;

        $scope.main.exitFirstModal = function () {
          $scope.main.firstTime = false;
        }

        $scope.currentUser = "sdjkhf";

        $scope.authObj.$onAuthStateChanged(function(firebaseUser) {

          if (firebaseUser) {

            $scope.currentUser = firebaseUser.uid;
            console.log($scope.currentUser);
            $scope.main.user = $firebaseObject(firebase.database().ref("users/" + $scope.currentUser));
            // console.log("f in as:", firebaseUser.uid);
            $cookies.put("userName", firebaseUser.uid);
            $location.path('/alum');
            $scope.main.loggedIn = true;

          } else {
            $cookies.remove("userName");
            console.log("Signed out");
          }

        });

        // $scope.logoutClick = function(event) {
        //   firebase.auth().signOut().then(function() {
        //     console.log("sign out successful)");
        //     $scope.main.loggedIn = false //is this necessary?
        //     $scope.main.hello = null;
        //     $location.path("/login-register");
        //   }, function(error) {
        //     //no errors?
        //   });
        // };

    $scope.main.logout = function() {
      firebase.auth().signOut().then(function() {
        $scope.main.loggedIn = false;
        console.log("sign out successful)");
        $location.path("/login-register");
      }, function(error) {
        //error in
      });
    };




        $scope.main.title = 'Users';



        $scope.$on('Close', function() {
            console.log("exit");
            $location.path("/login-register");
        });


        $rootScope.$on( "$stateChangeStart", function (event, next, current) {
          if (!$scope.main.loggedIn) {
            console.log("no one in");
             // no logged user, redirect to /login-register unless already there
            if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
                event.preventDefault();
                $state.go("login-register");
            }
          } else {
            console.log("loggedin");
          }
        }); 

        var selectedPhotoFile;   // Holds the last file selected by the user

            // Called on file selection - we simply save a reference to the file in selectedPhotoFile
            $scope.inputFileNameChanged = function (element) {
                selectedPhotoFile = element.files[0];
            };

            // Has the user selected a file?
            $scope.inputFileNameSelected = function () {
                return !!selectedPhotoFile;
            };

            // Upload the photo file selected by the user using a post request to the URL /photos/new
            $scope.uploadPhoto = function (shareList) {
                $scope.main.shareList = shareList;
                console.log(shareList);

                if (!$scope.inputFileNameSelected()) {
                    console.error("uploadPhoto called with no selected file");
                    return;
                }
                console.log('fileSubmitted', selectedPhotoFile);

                // Create a DOM form and add the file to it under the name uploadedphoto
                var domForm = new FormData();
                domForm.append('uploadedphoto', selectedPhotoFile);
                domForm.append('share', shareList);
                domForm.share = shareList;

                // Using $http to POST the form
                $http.post('/photos/new', domForm, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function(newPhoto){
                    console.log(JSON.stringify(newPhoto));
                    console.log(newPhoto);
                    var sessionSet = $resource('/getSession');
                    sessionSet.get({}, function(session) {
                        $route.reload();
                        $location.path("/photos/" + session.my_id);
                        $scope.main.addPhotoButton = false;
                       
                    });
                }).error(function(err){
                    // Couldn't upload the photo. XXX  - Do whatever you want on failure.
                    console.error('ERROR uploading photo', err);
                });

            };
    }
]);

cs142App.config(function ($mdThemingProvider) {
$mdThemingProvider.theme('default')
        .primaryPalette('light-green')
        .accentPalette('orange');
});
