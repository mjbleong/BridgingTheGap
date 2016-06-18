'use strict';

cs142App.controller('FavoritesController', ['$scope', '$routeParams', '$resource', '$http', '$rootScope','$location','$route',
  function ($scope, $routeParams, $resource, $http, $rootScope, $location, $route) {


  var us = $resource('/getFavorites');
  us.query(function(arr) {
    $scope.main.photosArray = [];
    arr.forEach(function(oneId) {
      var f = $resource('/getFavoritesPhoto/' + oneId);
        f.save(function(photo) {
           $scope.main.photosArray.push(photo);
        });
    });

});

    $scope.unfavorite = function(event, photoId) {
      console.log("unfavorited");
      var newFav = $resource('/unfavorite/' + photoId);
      newFav.save(function(user) {
        $scope.main.sessionUser = user;
          $route.reload();
      });
    };

$scope.main.opened = false;

    $scope.openMod = function(event, photoId, file, dt) {
      console.log("opened");
      $scope.main.opened = true;
      $scope.main.currFile = file;
      $scope.main.currDT = dt;
    };

    $scope.closeClick = function(event) {
      console.log("closed");
      $scope.main.opened = false;
      $route.reload();
    };


  }]);