'use strict';

cs142App.controller('ProfileController', ['$scope', '$routeParams', '$resource', '$firebaseArray', '$firebaseObject', '$sce', '$firebaseAuth', '$cookies', '$location', '$route', '$window',
  function($scope, $routeParams, $resource, $firebaseArray, $firebaseObject, $sce, $firebaseAuth, $cookies, $location, $route, $window) {

    var user_id = $cookies.get("userName");

    var userVideosRef = firebase.database().ref().child("users").child(user_id).child("videos");
    var videoIDsArray = $firebaseArray(userVideosRef);

    $scope.main.user = $firebaseObject(firebase.database().ref("/users/" + user_id));

    $scope.userProfiles = {};

    $scope.editing = false;
    $scope.main.introVideo = null;

    var mainVideosRef = firebase.database().ref().child("videos").orderByChild("author_id").equalTo(user_id);
    // $scope.main.videosArray = [];
    $scope.main.videosArray = $firebaseArray(mainVideosRef);

    // mainVideosRef.orderByChild("author_id").equalTo(user_id).on("child_added", function(videoObj) {
    //   var video = videoObj.val();
    //   if (video.url == $scope.main.user.intro_url) {
    //     console.log($scope.main.user.intro_url);
    //     $scope.main.introVideo = video;
    //   } else {
    //     $scope.main.videosArray.push(video);
    //   }
    // });

    $scope.showLiveWebcam = false;
    // $scope.main.videosArray = $firebaseArray(mainVideosRef);

    $scope.toggleEditMode = function() {
      console.log('toggle');
      console.log($scope.editing);
      $scope.main.user.$save();
      // if ($scope.editing === true) {
      //   // $scope.editing = false;
      //   $scope.main.user.$save();
      // } else {
      //   // $scope.editing = true;
      // }
    }

    $scope.make = function(link) {
      var youtube = "https://youtube.com/embed/" + link;
      var newLink = $sce.trustAsResourceUrl(youtube);
      return newLink;
    }

    // $scope.generateFrame = function(videoID) {
    //   console.log(videoID);
    //   var iframe = document.createElement("iframe");
    //   iframe.setAttribute("src", "//www.youtube.com/embed/" + videoID + "?autoplay=1&autohide=2d&showinfo=0&border=0&wmode=opaque&enablejsapi=1");
    //   iframe.setAttribute("frameborder", "0");
    //   iframe.setAttribute("id", "youtube-iframe");
    //   var oldPic = document.getElementById(videoID);
    //   var oldChild = document.getElementById(videoID + "-child");
    //   oldPic.replaceChild(iframe, oldChild);
    //   var playButtonId = 'play-circle-' + String(videoID);
    //   var playButtonParent = document.getElementById(videoID);
    //   console.log(playButtonParent);
    //   var playButton = document.getElementById(playButtonId);
    //   console.log(playButton);
    //   playButtonParent.removeChild(playButton);
    // }


    $scope.userProfiles.generateFrame = function(urlOrUser, fbID, views, subset) {
      $scope.userProfiles.modalOpen = true;
      console.log(fbID);
      if (fbID) {
        var currVid = $firebaseObject(firebase.database().ref().child("videos").child(fbID));
        var currLikes = $firebaseObject(firebase.database().ref().child("videos").child(fbID).child("likes"));
        console.log(currLikes);
        // var currVid2 = $firebaseObject(firebase.database().ref("videos/" + fbID + "/title"));
        $scope.userProfiles.currVid = currVid;
        var element = document.getElementById("alum-innerHTML");
        var elementInnerString = "";
        elementInnerString += '<iframe src="//www.youtube.com/embed/' + urlOrUser + '?autoplay=1&amp;autohide=2d&amp;showinfo=0&amp;border=0&amp;wmode=opaque&amp;enablejsapi=1" frameborder="0" width="400px" height="200px" allowfullscreen></iframe>';
        elementInnerString += '<div>' + views + ' views</div>';
        element.innerHTML = elementInnerString;
      } else {
        var title = document.getElementById("alum-modal-title-forChange");
        title.innerHTML = " " + urlOrUser.firstname + " " + urlOrUser.lastname;
        $scope.userProfiles.currVid = {};
        $scope.userProfiles.currVid.author_id = urlOrUser.$id;
        var element = document.getElementById("alum-innerHTML");
        element.innerHTML = '<iframe src="//www.youtube.com/embed/' + urlOrUser.intro_url + '?autoplay=1&amp;autohide=2d&amp;showinfo=0&amp;border=0&amp;wmode=opaque&amp;enablejsapi=1" frameborder="0" width="400px" height="200px" allowfullscreen></iframe>';
      }



    }
    $scope.main.closeClick = function() {
      $scope.userProfiles.modalOpen = false;
      var element = document.getElementById("alum-innerHTML");
      element.innerHTML = "";
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

      var insertedSpinner = false;

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          if (!insertedSpinner) {
            insertSpinner();
            insertedSpinner = true;
          }
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
          removeSpinner();
          $location.path('/myProfile');
        });


    };

    // Get the modal
    var modal = document.getElementById('modal-upload-or-webcam');
    // Get the button that opens the modal
    var btn = document.getElementById("myProfile-set-profile-picture-button");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[1];
    // When the user clicks on the button, open the modal 
    btn.onclick = function(event) {
      // $route.reload();
      modal.style.display = "block";
      $scope.showLiveWebcam = true;
      if (secondClick) { //if the user closes then reopens the webcam, refresh page. TODO: Fix this
        $window.location.reload();
      }
    }

    var secondClick = false;
    // // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
        $scope.showLiveWebcam = false;
        videoStream.getVideoTracks()[0].stop();
        secondClick = true;
      }
      // When the user clicks anywhere outside of the modal, close it
      // window.onclick = function(event) {
      //   if (event.target == modal) {
      //     modal.style.display = "none";
      //     $scope.showLiveWebcam = false;
      //     videoStream.getVideoTracks()[0].stop();
      //     secondClick = true;
      //     $route.reload();
      //   }
      // }

    //Webcam Controller Stuff
    var _video = null,
      patData = null;

    $scope.showDemos = false;
    $scope.edgeDetection = false;
    $scope.mono = false;
    $scope.invert = false;

    $scope.patOpts = {
      x: 0,
      y: 0,
      w: 25,
      h: 25
    };

    $scope.channel = {};

    $scope.webcamError = false;
    $scope.onError = function(err) {
      $scope.$apply(
        function() {
          $scope.webcamError = err;
        }
      );
    };

    $scope.onSuccess = function() {
      // The video element contains the captured camera data
      _video = $scope.channel.video;
      $scope.$apply(function() {
        $scope.patOpts.w = _video.width;
        $scope.patOpts.h = _video.height;
        $scope.showDemos = true;
      });
    };

    var videoStream;
    $scope.onStream = function(stream) {
      videoStream = stream;
      // You could do something manually with the stream.
    };

    /**
     * Make a snapshot of the camera data and show it in another canvas.
     */
    $scope.makeSnapshot = function makeSnapshot() {
      if (_video) {
        var patCanvas = document.querySelector('#myProfile-snapshot');
        if (!patCanvas) return;

        patCanvas.width = _video.width;
        patCanvas.height = _video.height;
        var ctxPat = patCanvas.getContext('2d');

        var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
        ctxPat.putImageData(idata, 0, 0);

        sendSnapshotToServer(patCanvas.toDataURL());

        patData = idata;
        $scope.showLiveWebcam = false;

        //resize window
        var rightModal = document.getElementById("modal-right");
        var parent = document.getElementById("modal-upload-or-webcam");
        console.log(parent);
        console.log(rightModal.clientHeight);
        console.log(parent.style.height);
        parent.style.height = rightModal.clientHeight;

        console.log(parent.style.height);
      }
    };

    $scope.toggleShowLiveWebcam = function() {
      $scope.showLiveWebcam = true;
    }

    /**
     * Redirect the browser to the URL given.
     * Used to download the image by passing a dataURL string
     */
    $scope.downloadSnapshot = function downloadSnapshot(dataURL) {
      window.location.href = dataURL;
    };

    var getVideoData = function getVideoData(x, y, w, h) {
      var hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = _video.width;
      hiddenCanvas.height = _video.height;
      var ctx = hiddenCanvas.getContext('2d');
      ctx.drawImage(_video, 0, 0, _video.width, _video.height);
      return ctx.getImageData(x, y, w, h);
    };

    /**
     * This function could be used to send the image data
     * to a backend server that expects base64 encoded images.
     *
     * In this example, we simply store it in the scope for display.
     */
    var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
      $scope.snapshotData = imgBase64;
    };


    //uploadSnapshot
    $scope.uploadSnapshot = function() {
      var storageRef = firebase.storage().ref();
      if ($scope.snapshotData == "") {
        console.error("no snapshot breh");
        return;
      }

      var file = $scope.snapshotData;
      file = dataURItoBlob(file);
      file.name = $scope.main.user.firstname + "_" + $scope.main.user.lastname + "_profile_picture.png";
      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTask = storageRef.child('profile-pictures/' + file.name).put(file);
      var insertedSpinner = false;
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          if (!insertedSpinner) {
            insertSpinner();
            insertedSpinner = true;
          }
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
          removeSpinner();
          var downloadURL = uploadTask.snapshot.downloadURL;
          console.log("Success: " + downloadURL);
          firebase.database().ref('/users/' + user_id + '/profile_picture_url').set(downloadURL);
          $location.path('/myProfile');
        });


    };

    function insertSpinner() {
      console.log("tried to insert spinner");
      var spinner = document.createElement("img");
      spinner.setAttribute("src", "images/gears-loader.gif");
      spinner.setAttribute("id", "upload-spinner");
      var child = document.getElementById("modal-upload-or-webcam");
      var parent = document.getElementById("modal-upload-or-webcam-parent");
      parent.replaceChild(spinner, child);
    }

    //Currently reloading entire page to reset the "Upload Photo" button. Would prefer no-reload.
    function removeSpinner() {
      // var child = document.getElementById("upload-spinner");
      // var parent = document.getElementById("modal-upload-or-webcam-parent");
      // parent.removeChild(child);
      $window.location.reload();
    }

    function dataURItoBlob(dataURI) {
      var byteString = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ab]);
      return blob;
    }

  }
]);