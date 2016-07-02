'use strict';

cs142App.controller('ProfileController', ['$scope', '$routeParams', '$resource', '$firebaseArray', '$firebaseObject', '$sce', '$firebaseAuth', '$cookies',
  function($scope, $routeParams, $resource, $firebaseArray, $firebaseObject, $sce, $firebaseAuth, $cookies) {

    $scope.main.loggedIn = true;

    var user_id = $cookies.get("userName");

    var userVideosRef = firebase.database().ref().child("users").child(user_id).child("videos");
    var videoIDsArray = $firebaseArray(userVideosRef);

    $scope.main.user = $firebaseObject(firebase.database().ref("/users/" + user_id));

    $scope.editing = false;
    $scope.main.introVideo = null;

    var mainVideosRef = firebase.database().ref().child("videos");
    $scope.main.urlsArray = [];
    // mainVideosRef.orderByChild("author_id").equalTo(user_id).on("child_added", function(videoObj) {
    //   var videoURL = videoObj.val().url;
    //   $scope.main.urlsArray.push(videoURL);
    // });
    $scope.main.videosArray = [];
    mainVideosRef.orderByChild("author_id").equalTo(user_id).on("child_added", function(videoObj) {
      var video = videoObj.val();
      if(video.url == $scope.main.user.intro_url) {
        console.log($scope.main.user.intro_url);
        $scope.main.introVideo = video;
      } else {
        $scope.main.videosArray.push(video);
      }

    });



    // $scope.main.videosArray = $firebaseArray(mainVideosRef);

    $scope.toggleEditMode = function() {
      console.log('toggle');
      console.log($scope.editing);
      if ($scope.editing === true) {
        $scope.editing = false;
        $scope.main.user.$save();
      } else {
        $scope.editing = true;
      }
    }

    $scope.make = function(link) {
      var youtube = "https://youtube.com/embed/" + link;
      var newLink = $sce.trustAsResourceUrl(youtube);
      return newLink;
    }

    $scope.generateFrame = function(videoID) {
      console.log(videoID);
      var iframe = document.createElement("iframe");
      iframe.setAttribute("src", "//www.youtube.com/embed/" + videoID + "?autoplay=1&autohide=2&border=0&wmode=opaque&enablejsapi=1");
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


    var selectedPhotoFile; // Holds the last file selected by the user

    // Called on file selection - we simply save a reference to the file in selectedPhotoFile
    $scope.inputFileNameChanged = function(element) {
      selectedPhotoFile = element.files[0];
    };

    // Has the user selected a file?
    $scope.inputFileNameSelected = function() {
      return !!selectedPhotoFile;
    };
    // Upload the photo file selected by the user using a post request to the URL /photos/new
    $scope.uploadPhoto = function() {
      var storageRef = firebase.storage().ref();
      if (!$scope.inputFileNameSelected()) {
        console.error("uploadPhoto called with no selected file");
        return;
      }
      console.log('fileSubmitted', selectedPhotoFile);

      // File or Blob named mountains.jpg
      var file = selectedPhotoFile;

      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTask = storageRef.child('profile-pictures/' + file.name).put(file);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        },
        function(error) {
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;

            case 'storage/canceled':
              // User canceled the upload
              break;

            case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
          }
        },
        function() {
          // Upload completed successfully, now we can get the download URL
          var downloadURL = uploadTask.snapshot.downloadURL;
          console.log("Success: " + downloadURL);
          firebase.database().ref('/users/' + user_id + '/profile_picture_url').set(downloadURL);

        });


    };

    //
    // Get the modal
    var modal = document.getElementById('upload-modal');
    console.log(modal)
      // Get the button that opens the modal
    var btn = document.getElementById("upload-photo-button");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
      }
      // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
      }
      // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }




  }
]);