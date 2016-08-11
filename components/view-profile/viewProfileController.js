'use strict';

cs142App.controller('ViewProfileController', ['$scope', '$routeParams', '$resource', '$firebaseArray', '$firebaseObject', '$sce', '$firebaseAuth', '$cookies', '$location', '$route', '$window', '$stateParams',
  function($scope, $routeParams, $resource, $firebaseArray, $firebaseObject, $sce, $firebaseAuth, $cookies, $location, $route, $window, $stateParams) {

    var user_id = $stateParams.userID;

    var userVideosRef = firebase.database().ref().child("users").child(user_id).child("videos");
    var videoIDsArray = $firebaseArray(userVideosRef);

    $scope.viewProfile = {};
    $scope.viewProfile.user = $firebaseObject(firebase.database().ref("/users/" + user_id));

    // $scope.main.user = $firebaseObject(firebase.database().ref("/users/" + user_id));

    var mainVideosRef = firebase.database().ref().child("videos").orderByChild("author_id").equalTo(user_id);
    // $scope.main.videosArray = [];
    $scope.main.videosArray = $firebaseArray(mainVideosRef);

    $scope.make = function(link) {
      var youtube = "https://youtube.com/embed/" + link;
      var newLink = $sce.trustAsResourceUrl(youtube);
      return newLink;
    }

    $scope.viewProfile.generateFrame = function(urlOrUser, fbID, views, subset) {
      $scope.viewProfile.modalOpen = true;
      console.log(fbID);
      if (fbID) {
        var currVid = $firebaseObject(firebase.database().ref().child("videos").child(fbID));
        var currLikes = $firebaseObject(firebase.database().ref().child("videos").child(fbID).child("likes"));
        console.log(currLikes);
        // var currVid2 = $firebaseObject(firebase.database().ref("videos/" + fbID + "/title"));
        $scope.viewProfile.currVid = currVid;
        var element = document.getElementById("alum-innerHTML");
        var elementInnerString = "";
        elementInnerString += '<iframe src="//www.youtube.com/embed/' + urlOrUser + '?autoplay=1&amp;autohide=2d&amp;showinfo=0&amp;border=0&amp;wmode=opaque&amp;enablejsapi=1" frameborder="0" width="400px" height="200px" allowfullscreen></iframe>';
        elementInnerString += '<div>' + views + ' views</div>';
        element.innerHTML = elementInnerString;
      } else {
        var title = document.getElementById("alum-modal-title-forChange");
        title.innerHTML = " " + urlOrUser.firstname + " " + urlOrUser.lastname;
        $scope.viewProfile.currVid = {};
        $scope.viewProfile.currVid.author_id = urlOrUser.$id;
        var element = document.getElementById("alum-innerHTML");
        element.innerHTML = '<iframe src="//www.youtube.com/embed/' + urlOrUser.intro_url + '?autoplay=1&amp;autohide=2d&amp;showinfo=0&amp;border=0&amp;wmode=opaque&amp;enablejsapi=1" frameborder="0" width="400px" height="200px" allowfullscreen></iframe>';
      }
    }

    $scope.main.closeClick = function() {
      $scope.viewProfile.modalOpen = false;
      var element = document.getElementById("alum-innerHTML");
      element.innerHTML = "";
    }
  }

]);