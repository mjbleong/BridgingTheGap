'use strict';

cs142App.controller('ProfileController', ['$scope', '$routeParams', '$resource', '$firebaseArray', '$firebaseObject', '$sce', '$firebaseAuth', '$cookies',
  function ($scope, $routeParams, $resource, $firebaseArray, $firebaseObject, $sce, $firebaseAuth, $cookies) {

    $scope.main.loggedIn = true;

    var user_id = $cookies.get("userName");

    var userVideosRef = firebase.database().ref().child("users").child(user_id).child("videos");
    var videoIDsArray = $firebaseArray(userVideosRef);

    var mainVideosRef = firebase.database().ref().child("videos");
    $scope.main.urlsArray = [];

    mainVideosRef.orderByChild("author_id").equalTo("93yiHysORxTxe50apxf0kHKGTm83").on("child_added",function(videoObj){
      var videoURL = videoObj.val().url;
      $scope.main.urlsArray.push(videoURL);
    });


    

    $scope.make = function (link) {
      var youtube = "https://youtube.com/embed/" + link;
      var newLink = $sce.trustAsResourceUrl(youtube);
      return newLink;
    }




  }]);
