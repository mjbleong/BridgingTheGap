'use strict';

cs142App.controller('UploadVideoController', ['$scope', '$routeParams', '$resource', '$http', '$rootScope','$location','$firebaseAuth', '$cookies',
  function ($scope, $routeParams, $resource, $http, $rootScope, $location, $firebaseAuth, $cookies) {

  	// need to get name out here... scoping problem when inside clipchamp
  	$scope.fname = "";
  	$scope.lname = "";
    
    var user_id = $cookies.get("userName");
  	firebase.database().ref('users/' + user_id).once('value').then(function(snapshot) {
		  $scope.fname = snapshot.val().firstname;
		  $scope.lname = snapshot.val().lastname;
	});

  	$scope.clipchamp = function() {

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
            	console.log("hithereee");

            	// code for the modal window
                var modal = document.getElementById('myModal');
                var span = document.getElementsByClassName("close")[0];
                span.onclick = function() {
                    modal.style.display = "none";
                };
                modal.style.display = "block";

                //function to extract id from youtube url
                function getId(url) {
				    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
				    var match = url.match(regExp);

				    if (match && match[2].length == 11) {
				        return match[2];
				    } else {
				        return 'error';
				    }
				}

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

                var iframe = document.createElement("iframe");
                iframe.width='420';
                iframe.height='315';
                iframe.src= '//www.youtube.com/embed/' + myId;
                var element = document.getElementById('videos');
                element.appendChild(iframe);
            },
            
        });
		process.open();
  	}
  }
  ]);