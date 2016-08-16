'use strict';

cs142App.controller('UploadVideoController', ['$scope', '$routeParams', '$resource', '$http', '$rootScope','$location','$firebaseAuth', '$cookies','$route', '$state',
  function ($scope, $routeParams, $resource, $http, $rootScope, $location, $firebaseAuth, $cookies, $route, $state) {
    

    $scope.upload = {};

    console.log('hi');

    $scope.upload.videoRecorded = false;
    $scope.upload.title_desc_set = false;
    $scope.upload.tagsSet = false;
    $scope.upload.modalOpen = false;

    //$scope.upload.videoId = 'bloopid2'; this is the default videoId for when you don't use clipchamp to upload a video

    $scope.checkboxModel = {};

    $scope.upload.title = '';
    $scope.upload.description = '';

    $scope.upload.tagStyle = 
    {
      'applying-to-college': {'background-color': '#FFAAAA',
                              'margin': '5px'},
      'paying-for-college': {'background-color': '#9376AC',
                              'margin': '5px'},
      'finding-community': {'background-color': '#718EA4',
                              'margin': '5px'},
      'significant-others': {'background-color': '#73AC96',
                              'margin': '5px'}
    };

    firebase.database().ref('tag-categories').once('value').then(function(snapshot) {
      $scope.checkboxModel = snapshot.val();
      for (var cat_a in $scope.checkboxModel) {
        for (var tag_a in $scope.checkboxModel[cat_a].tags) {
            $scope.checkboxModel[cat_a].tags[tag_a]['checked'] = false;
        }
      }
      console.log($scope.checkboxModel);
    });

    $scope.setTitleDesc = function() {
      $scope.upload.title_desc_set = true;
    }

    $scope.uploadTags = function() {
      $scope.upload.tagsSet = true;
    }

    $scope.goHome = function() {
      $state.go('/myProfile/' + $scope.currentUser);
    }

    $scope.upload.removeTag = function(cat,tag) {
      $scope.checkboxModel[cat].tags[tag].checked = false;
    }

    $scope.showStuff = function() {
      $scope.upload.show = true;
      console.log($scope.upload.video_src);
    }

    $scope.upload.postVideo = function() {
      $scope.upload.modalOpen = true;
      for (var category in $scope.checkboxModel) {
        for (var tag in $scope.checkboxModel[category].tags) {
          if ($scope.checkboxModel[category].tags[tag].checked == true) {
            firebase.database().ref('videos/' + $scope.upload.videoId + '/tags/' + category + '/' + tag).set('');
            firebase.database().ref('tag-categories/' + category + '/tags/' + tag + '/' + $scope.upload.videoId).set('');  
          }
        }
      }
      firebase.database().ref('videos/' + $scope.upload.videoId + '/title').set($scope.upload.title);
      firebase.database().ref('videos/' + $scope.upload.videoId + '/description').set($scope.upload.description);
      firebase.database().ref('videos/' + $scope.upload.videoId + '/timestamp').set(Date.now());  
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

      var process = clipchamp({

        resolution: "720p",
        preset: "web",
        title: "Click submit and you're done. Thanks!",
        output: "youtube",
        youtube: {
          title: yt_title,
          description: '[no description]'
        },

        onUploadComplete: function(data) {
          $scope.upload.videoRecorded = true;

          // $route.reload();

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
              title: 'no-title',
              url: myId,
              views: 0,
              likes: '',
              num_likes: 0
          });

          $scope.upload.videoId = newPostKey;

          var iframe1 = document.createElement("iframe");
          iframe1.width='420';
          iframe1.height='315';
          iframe1.src= '//www.youtube.com/embed/' + myId;

          var iframe2 = document.createElement('iframe');
          iframe2.width='420';
          iframe2.height='315';
          iframe2.src='//www.youtube.com/embed/' + myId;

          var element1 = document.getElementById('upload-videos');
          var element2 = document.getElementById('upload-showVideo');
          element1.appendChild(iframe1);
          element2.appendChild(iframe2);
        }      
      });

  process.open();
  }
  }
  ]);