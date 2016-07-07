'use strict';

cs142App.controller('ViewProfileController', ['$scope', '$routeParams', '$resource', '$firebaseArray', '$firebaseObject', '$sce', '$firebaseAuth', '$cookies', '$location', '$route', '$window', '$stateParams',
  function($scope, $routeParams, $resource, $firebaseArray, $firebaseObject, $sce, $firebaseAuth, $cookies, $location, $route, $window, $stateParams) {

    var user_id = $stateParams.userID;

    var userVideosRef = firebase.database().ref().child("users").child(user_id).child("videos");
    var videoIDsArray = $firebaseArray(userVideosRef);

    $scope.main.user = $firebaseObject(firebase.database().ref("/users/" + user_id));

    $scope.main.introVideo = null;

    var mainVideosRef = firebase.database().ref().child("videos");
    $scope.main.videosArray = [];
    mainVideosRef.orderByChild("author_id").equalTo(user_id).on("child_added", function(videoObj) {
      var video = videoObj.val();
      if (video.url == $scope.main.user.intro_url) {
        console.log($scope.main.user.intro_url);
        $scope.main.introVideo = video;
      } else {
        $scope.main.videosArray.push(video);
      }

    });

    $scope.make = function(link) {
      var youtube = "https://youtube.com/embed/" + link;
      var newLink = $sce.trustAsResourceUrl(youtube);
      return newLink;
    }

    $scope.generateFrame = function(videoID) {
      console.log(videoID);
      var iframe = document.createElement("iframe");
      iframe.setAttribute("src", "//www.youtube.com/embed/" + videoID + "?autoplay=1&autohide=2d&showinfo=0&border=0&wmode=opaque&enablejsapi=1");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("id", "youtube-iframe");
      var oldPic = document.getElementById(videoID);
      var oldChild = document.getElementById(videoID + "-child");
      oldPic.replaceChild(iframe, oldChild);
      var playButtonId = 'play-circle-' + String(videoID);
      var playButtonParent = document.getElementById(videoID);
      console.log(playButtonParent);
      var playButton = document.getElementById(playButtonId);
      console.log(playButton);
      playButtonParent.removeChild(playButton);
    }
  }
    
]);