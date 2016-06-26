'use strict';

cs142App.controller('UploadVideoController', ['$scope', '$routeParams', '$resource', '$http', '$rootScope','$location','$firebaseAuth', '$cookies','$route',
  function ($scope, $routeParams, $resource, $http, $rootScope, $location, $firebaseAuth, $cookies, $route) {
    $scope.upload = {};

    $scope.upload.show = false;
    $scope.upload.videoId = 'bloopid2';
    $scope.checkboxModel = {};
    $scope.upload.title = '';
    $scope.upload.description = '';
    $scope.upload.description_char_count = 0;

    firebase.database().ref('tags').once('value').then(function(snapshot) {
      $scope.checkboxModel = snapshot.val();
    });

    $scope.showStuff = function() {
      $scope.upload.show = true;
    }

    $scope.upload.postVideo = function() {
      console.log($scope.checkboxModel);
      for (var category in $scope.checkboxModel) {
        console.log(category);
        for (var tag in $scope.checkboxModel[category]) {
          if ($scope.checkboxModel[category][tag] == true) {
            firebase.database().ref('videos/' + $scope.upload.videoId + '/tags/' + tag).set('');
            firebase.database().ref('tags/' + category + '/' + tag + '/' + $scope.upload.videoId).set('');  
          }
        }
      }
      firebase.database().ref('videos/' + $scope.upload.videoId + '/title').set($scope.upload.title);
      firebase.database().ref('videos/' + $scope.upload.videoId + '/description').set($scope.upload.description);
    }

    // need to get name out here... scoping problem when inside clipchamp
    $scope.fname = "";
    $scope.lname = "";
    
    var user_id = $cookies.get("userName");
    
    firebase.database().ref('users/' + user_id).once('value').then(function(snapshot) {
      $scope.fname = snapshot.val().firstname;
      $scope.lname = snapshot.val().lastname;
    });

    $scope.clipchamp = function(data) {

      var currDate = new Date();

      var yt_title = $scope.fname + ' ' + $scope.lname + ' ' + currDate;

      var dbDate = '' + currDate;

      var process = clipchamp({

        resolution: "720p",
        preset: "web",
        title: "Click submit and you're done. Thanks!",
        output: "youtube",
        youtube: {
          title: yt_title,
          description: 'wut wut'
        },

        onUploadComplete: function(data) {
          $scope.upload.show = true;

          $route.reload();

          //function to extract id from youtube url
          function getId(url) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);

            if (match && match[2].length == 11) {
                return match[2];
            } else {
                return 'error';
            }
          };

          var myId = getId(data.url);

          var dbDate = new Date();

          var newPostKey = firebase.database().ref('users/' + $scope.currentUser + "/videos")
            .push('').key;

          firebase.database().ref('videos/' + newPostKey).set({
              author_id: $scope.currentUser,
              date: dbDate,
              title: "dfhadfjadp",
              url: myId
          });

          $scope.upload.videoId = newPostKey;

          var iframe = document.createElement("iframe");
          iframe.width='420';
          iframe.height='315';
          iframe.src= '//www.youtube.com/embed/' + myId;
          var element = document.getElementById('videos');
          element.appendChild(iframe);
        }      
      });

  process.open();
  }
  }
  ]);