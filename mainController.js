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

cs142App.controller('MainController', ['$scope', '$resource', '$rootScope', '$location', '$http', '$route', "$firebaseAuth", '$cookies', '$firebaseObject','$state',
    function ($scope, $resource, $rootScope, $location, $http, $route, $firebaseAuth, $cookies, $firebaseObject, $state) {

        $scope.main = {};
        $scope.authObj = $firebaseAuth();
        $scope.main.addPhotoButton = false;
        $scope.main.hello = null;
        $scope.main.loggedIn = false;
        $scope.main.firstTime = true;

        $scope.main.exitFirstModal = function () {
          $scope.main.firstTime = false;
        }

        $scope.currentUser = "sdjkhf";
        $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
          if (firebaseUser) {
            $scope.currentUser = firebaseUser.uid;
            console.log($scope.currentUser);
            $scope.main.user = $firebaseObject(firebase.database().ref("users/" + $scope.currentUser));
            console.log("Signed in as:", firebaseUser.uid);
            $cookies.put("userName", firebaseUser.uid);
          } else {
            $cookies.remove("userName");
            console.log("Signed out");
          }
        });

        // $scope.main.studentHome = function() {
        //         console.log("go to student home");
        //         $location.path("/alum");
        // };

        // $scope.main.profileHome = function() {
        //         console.log("go to profile");
        //         $location.path("/myProfile");
        // };

        // $scope.main.uploadVideo = function() {
        //         console.log("go to upload");
        //         $location.path("/upload-video");
        // };

        // $scope.main.viewProfile = function() {
        //   console.log("about to view profile");
        //   $location.path("/viewProfile/Hxg6yr8TafQWhU4njnTVhINDdvX2");
        // }


       //  $scope.main.myProfile = function() {
       //   console.log("see my prof");
       //   $location.path("/myProfile");
       // }



        $scope.main.title = 'Users';
        // var session = $resource('/getSession').get({});
        // $scope.main.loggedIn = session.login_name;
        // console.log(session.login_name);

        $scope.$on('Close', function() {
            console.log("exit");
            $location.path("/login-register");
        });

        $rootScope.$on('$stateChangeStart', function (event, next, current) {
          if (!$scope.main.loggedIn) {
            console.log("no one in");
             // no logged user, redirect to /login-register unless already there
            if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
              event.preventDefault();
              $state.go('login-register');
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

// cs142App.factory("userPersistenceService", [
//     "$cookies", function($cookies) {
//         var userName = "";

//         return {
//             setCookieData: function(username) {
//                 console.log($scope.currentUser);
//                 userName = username;
//                 $cookies.put("userName", $scope.currentUser);
//             },
//             getCookieData: function() {
//                 userName = $cookies.get("userName");
//                 return userName;
//             },
//             clearCookieData: function() {
//                 userName = "";
//                 $cookies.remove("userName");
//             }
//         }
//     }
// ]);

cs142App.config(function ($mdThemingProvider) {
$mdThemingProvider.theme('default')
        .primaryPalette('light-green')
        .accentPalette('orange');
});