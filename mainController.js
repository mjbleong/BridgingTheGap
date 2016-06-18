'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial','ngResource']);

cs142App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/login-register', {
                templateUrl: 'components/login-register/login-registerTemplate.html',
                controller: 'LoginRegisterController'
            }).
            when('/users', {
                templateUrl: 'components/user-list/user-listTemplate.html',
                controller: 'UserListController'
            }).
            when('/users/:userId', {
                templateUrl: 'components/user-detail/user-detailTemplate.html',
                controller: 'UserDetailController'
            }).
            when('/photos/:userId', {
                templateUrl: 'components/user-photos/user-photosTemplate.html',
                controller: 'UserPhotosController'
            }).
            when('/photos/:userId/:photoId', {
                templateUrl: 'components/user-photos/user-photosTemplate-extra.html',
                controller: 'UserPhotosController'
            }).
            when('/login-register', {
                templateUrl: 'components/login-register/login-registerTemplate.html',
                controller: 'LoginRegisterController'
            }).
            when('/favorites', {
                templateUrl: 'components/favorites/favoritesTemplate.html',
                controller: 'FavoritesController'
            }).
            otherwise({
                redirectTo: '/users'
            });
    }]);

cs142App.controller('MainController', ['$scope', '$resource', '$rootScope', '$location', '$http', '$route',
    function ($scope, $resource, $rootScope, $location, $http, $route) {
        $scope.main = {};
        $scope.main.addPhotoButton = false;
        $scope.main.hello = null;

        $scope.addPhotoClick = function(event) {   
            $scope.main.addPhotoButton = !$scope.main.addPhotoButton;
        var UserList = $resource('/user/list', {
          query: {method: 'get', isArray: true}
        });

        UserList.query(function(userList) {
          $scope.main.userArrayNew = userList;
            $scope.checkedUsers = [];
            $scope.addUser = function(user) {
            if ($scope.checkedUsers.indexOf(user) !== -1) {
                var newThing =[];
                $scope.checkedUsers.forEach( function (elem) {
                    if (elem !==user) {
                        newThing.push(elem);
                    }
                });
                $scope.checkedUsers = newThing;
                return;
            }
            $scope.checkedUsers.push(user);
            };
        });
        };

         $scope.logoutClick = function(event) {
            var logout = $resource('/admin/logout');
            logout.save(function() {
                $scope.main.loggedIn = false;
                $rootScope.$broadcast('Close');
                $scope.main.hello = null;
            });
        };


        $scope.main.title = 'Users';
        var session = $resource('/getSession').get({});
        $scope.main.loggedIn = session.login_name;

        $scope.$on('Close', function() {
            console.log("exit");
            $location.path("/login-register");
        });

        var TestInfo = $resource('/test/info', {
          get: {method: 'get', isArray: false}
        });

        TestInfo.get(function(info) {
            $scope.main.version = info.version; 
        });

        $rootScope.$on( "$routeChangeStart", function (event, next, current) {
          if (!$scope.main.loggedIn) {
            console.log("no one in");
             // no logged user, redirect to /login-register unless already there
            if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
                $location.path("/login-register");
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
