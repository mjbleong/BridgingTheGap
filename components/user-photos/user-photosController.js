'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams', '$resource', '$location', "$route",
  function ($scope, $routeParams, $resource, $location, $route) {

    var userId = $routeParams.userId;

    var session2 = $resource('getSession', {
          get: {method: 'get', isArray: false}
        });
    var nameLogIn = "";
    session2.get(function(info) {
      nameLogIn =  info.login_name;
      $scope.main.loggedIn = info.login_name;
      $scope.main.loggedInId = info.my_id;
      var sessUs = $resource('/user/:id', {id: '@id'}, {
        get: {method: 'get', isArray: false}
      });
      sessUs.get({id: info.my_id}, function(user) {
        $scope.main.sessionCurrUser = user;
});

    });

    var PhotoListOfUser = $resource('/photosOfUser/:id', {id: '@id'}, {
      query: {method: 'get', isArray: true}
    });
    PhotoListOfUser.query({id: userId}, function(userPhotos) {
      $scope.main.allPhotosCurr = userPhotos;
      $scope.main.photosLength = userPhotos.length;
      $scope.main.photoId = parseInt($routeParams.photoId);
      $scope.main.photo = userPhotos[$scope.main.photoId];



      var currUser = $resource('/user/:id', {id: '@id'}, {
        get: {method: 'get', isArray: false}
      });
      currUser.get({id: userId}, function(user) {
        $scope.main.currUser = user;
        $scope.main.currUserFullName = user.first_name + " " + user.last_name;
        $scope.main.title = 'Photos of ' + $scope.main.currUserFullName;
      });
    });


    $scope.favorite = function(event, photoId) {
      console.log("favorited");
      var newFav = $resource('/favorite/' + photoId);
      newFav.save(function(user) {
        $scope.main.sessionUser = user;
          $route.reload();
      });
    };

    $scope.unfavorite = function(event, photoId) {
      console.log("unfavorited");
      var newFav = $resource('/unfavorite/' + photoId);
      newFav.save(function(user) {
        $scope.main.sessionUser = user;
          $route.reload();
      });
    };


    $scope.like = function(event, photoId) {
      $scope.main.inUse = true;
      console.log("liked");
      var newLike = $resource('/like/' + photoId);
      newLike.save(function(photo) {
          $scope.main.likesList = photo.likes;
          console.log(photo.likes);
          $route.reload();
          $scope.main.inUse = false;
      });
    };

    $scope.unlike = function(event, photoId) {
      $scope.main.inUse = true;
      console.log("unliked");
      var newUnLike = $resource('/unlike/' + photoId);
      newUnLike.save(function(photo) {
          $scope.main.likesList = photo.likes;
          console.log(photo.likes);
          $route.reload();
          $scope.main.inUse = false;

      });
    };
    
    $scope.commentClickFunc = function(event, photoId, comment) {
      console.log("in");
      console.log(photoId);
      console.log(comment);
      var timeStamp = new Date();
      var newCom = $resource('/commentsOfPhoto/' + photoId);
      var modelObj = {comment: comment};
      newCom.save(modelObj, function(currPhotosUser) {
          var PhotoListOfUser = $resource('/photosOfUser/:id', {id: '@id'}, {
            query: {method: 'get', isArray: true}
          });
          PhotoListOfUser.query({id: currPhotosUser.user_id}, function(userPhotos) {
            console.log(userPhotos);
            $scope.main.allPhotosCurr = userPhotos;
            $scope.main.photoId = parseInt($routeParams.photoId);
            $scope.main.photo = userPhotos[$scope.main.photoId];

            var currUser = $resource('/user/:id', {id: '@id'}, {
              get: {method: 'get', isArray: false}
            });

            currUser.get({id: currPhotosUser.user_id}, function(user) {
              $scope.main.currUser = user;
              $scope.main.currUserFullName = user.first_name + " " + user.last_name;
              $scope.main.title = 'Photos of ' + $scope.main.currUserFullName;

            });

    });

          });
        

    };


  }]);
