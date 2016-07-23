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
    $scope.upload.tab = 1;
    $scope.upload.video_src = 'hello';

    $scope.upload.tagStyle = 
    {
      'applying-to-college': {'background-color': 'red'},
      'paying-for-college': {'background-color': 'green'},
      'finding-community': {'background-color': 'blue'},
      'significant-others': {'background-color': '#ff9900'}
    };

    firebase.database().ref('tag-categories').once('value').then(function(snapshot) {
      $scope.checkboxModel = snapshot.val();
      for (var cat in $scope.checkboxModel) {
        for (var tag_o in $scope.checkboxModel[cat].tags) {
            $scope.checkboxModel[cat].tags[tag_o]['checked'] = false;
        }
      }
      console.log($scope.checkboxModel);
    });

    $scope.upload.removeTag = function(cat,tag) {
      $scope.checkboxModel[cat].tags[tag].checked = false;
    }

    $scope.upload.switchTabForward = function() {
      document.getElementById('tab-' + $scope.upload.tab).style.backgroundColor = '#99ccff';
      $scope.upload.tab = $scope.upload.tab + 1;
      document.getElementById('tab-' + $scope.upload.tab).style.backgroundColor = '#00bca4';
    }

    $scope.upload.switchTabBackward = function() {
      document.getElementById('tab-' + $scope.upload.tab).style.backgroundColor = '#99ccff';
      $scope.upload.tab = $scope.upload.tab - 1;
      document.getElementById('tab-' + $scope.upload.tab).style.backgroundColor = '#00bca4';
    }


    // $scope.seeCheckbox = function(category,tag) {
    //   var tag_table = document.getElementById('upload-show-tags');
    //   var tag_name = $scope.checkboxModel[category].tags[tag].name;
    //   var tag_div = document.createElement("div");
    //   tag_div.innerHTML = ' ' + tag_name + ' ';
    //   tag_div.style.backgroundColor = 'red';
    //   tag_div.style.margin = '5px';
    //   tag_div.style.height = '24px';
    //   tag_div.class = 'upload-tag-div';

    //   tag_table.appendChild(tag_div);
    // }

    $scope.upload.switchTab = function(tabNum) {
      $scope.upload.tab = tabNum;
    }

    $scope.showStuff = function() {
      $scope.upload.show = true;
      console.log($scope.upload.video_src);
    }

    $scope.upload.postVideo = function() {
      console.log($scope.checkboxModel);
      for (var category in $scope.checkboxModel) {
        for (var tag in $scope.checkboxModel[category].tags) {
          if ($scope.checkboxModel[category].tags[tag].checked == true) {
            console.log('bloopi')
            firebase.database().ref('videos/' + $scope.upload.videoId + '/tags/' + category + '/' + tag).set('');
            firebase.database().ref('tag-categories/' + category + '/tags/' + tag + '/' + $scope.upload.videoId).set('');  
          }
        }
      }
      console.log('hi');
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

          var iframe1 = document.createElement("iframe");
          iframe1.width='420';
          iframe1.height='315';
          iframe1.src= '//www.youtube.com/embed/' + myId;

          var iframe2 = document.createElement('iframe');
          iframe2.width='420';
          iframe2.height='315';
          iframe2.src='//www.youtube.com/embed/' + myId;

          var element1 = document.getElementById('videos');
          var element2 = document.getElementById('showVideo');
          element1.appendChild(iframe1);
          element2.appendChild(iframe2);
        }      
      });

  process.open();
  }
  }
  ]);