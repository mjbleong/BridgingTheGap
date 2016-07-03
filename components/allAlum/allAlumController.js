'use strict';

cs142App.controller('AlumController', ['$scope', '$resource', '$firebaseObject', '$location', '$firebaseArray', '$sce', '$stateParams', '$state','$cookies','$route',
    function ($scope, $resource, $firebaseObject, $location, $firebaseArray, $sce, $stateParams, $state, $cookies, $route) {
        $scope.main.title = 'Overfelt Alumni';
        $scope.main.user_id = $cookies.get("userName");

        $scope.main.page = $stateParams.page;
        console.log($stateParams.page);

        var ref = firebase.database().ref().child("users");
        // download the data into a local object
        var userArray = $firebaseArray(ref);
        $scope.main.userArray = userArray;

        var vid = firebase.database().ref().child("videos");
        // download the data into a local object
        var videosArray = $firebaseArray(vid);
        $scope.main.videosArray = videosArray;
        console.log("vidarr");
        console.log(videosArray);

        $scope.main.showVidBox = false;

        $scope.clickedFace = function (url) {
            $scope.main.showVidBox = true;
            $scope.main.currURL = url;
        }

        $scope.closeVid = function () {
            $scope.main.showVidBox = false;
        }

        $scope.make = function (link) {
            var youtube = "https://youtube.com/embed/" + link;
            var newLink = $sce.trustAsResourceUrl(youtube);
            return newLink;
        }

        // var messagesRef = new Firebase("https://project-2333752665176102876.firebaseio.com/");
        // var query = messagesRef.orderByChild("date").limitToLast(2);
        // console.log(query);

        // var mostRecArray = [];
        // var recentQuery = firebase.database().ref().child("videos").orderByChild("date").limitToLast(2).on("child_added", function(snapshot) {
        //     console.log(snapshot.val());
        //     mostRecArray.push(snapshot.val());
        //     console.log(mostRecArray);
        //     $scope.main.mostRecArray = mostRecArray;

        // });


        // var mostRecArray = [];
        // var recentQuery = firebase.database().ref().child("videos").orderByChild("date").limitToLast(6).on("child_added", function(snapshot) {
        //     mostRecArray.push(snapshot.val());
        //     $scope.main.mostRecArray = mostRecArray;
        // });
        var recentQuery = firebase.database().ref().child("videos").orderByChild("date").limitToLast(9);
        $scope.main.mostRecArray = $firebaseArray(recentQuery);
        $scope.main.mostRecArray["name"] = "Most Recent";
        $scope.main.mostRecArray["id"] = "mr";
        console.log($scope.main.mostRecArray);

        var viewsQuery = firebase.database().ref().child("videos").orderByChild("views").limitToLast(9);
        $scope.main.mostViewsArray = $firebaseArray(viewsQuery);
        $scope.main.mostViewsArray["name"] = "Most Viewed";
        $scope.main.mostViewsArray["id"] = "mv";
        console.log($scope.main.mostViewsArray);


        // var likesQuery = firebase.database().ref().child("videos").orderByChild("likes").limitToLast(9);
        // $scope.main.mostViewsArray = $firebaseArray(likesQuery);
        // console.log($scope.main.mostViewsArray);

        var allOfThem = [];
        allOfThem.push($scope.main.mostRecArray);
        allOfThem.push($scope.main.mostViewsArray);
        $scope.main.allOfThem = allOfThem;

        $scope.goForward = function (id) {
            var firstThing = document.getElementById(id);
            var th = false;
            if (firstThing.style.animationName === "bannermove2") {
                th = true;
            }
            var left = getComputedStyle(firstThing).getPropertyValue("margin-left");
            console.log(left);
            if (th) {
                console.log("switch");
                var length = left.length;
                left= left.substring(0,length-2);
                left /= 71;
                left *= (-1);
                var p = 30-left;
                left *= (-1);
                firstThing.style.animationDelay = left + "s";
            }
            firstThing.style.animationName="bannermove";
            firstThing.style.animationPlayState = "running";
        }

        $scope.stopForward = function (id) {
            var firstThing = document.getElementById(id);
            firstThing.style.WebkitAnimationPlayState = "paused";
        }

        $scope.goBackward = function (id) {
            var firstThing = document.getElementById(id);
            var th = false;
            if (firstThing.style.animationName === "bannermove") {
                th = true;
            }
            var left = getComputedStyle(firstThing).getPropertyValue("margin-left");
            if (left === "0px") {
                console.log("don't move");
            } else {
                console.log(left);
                if (th && left !== "0px") {
                    console.log("back switch");
                    var length = left.length;
                    left = left.substring(0,length-2);
                    left /= 71;
                    left *= (-1);
                    left = 30-left;
                    left *= (-1);
                    firstThing.style.animationDelay = left + "s";
                }
                firstThing.style.animationName="bannermove2";
                firstThing.style.animationPlayState = "running";
            }
        }

        $scope.stopBackward = function (id) {
            var firstThing = document.getElementById(id);
            firstThing.style.WebkitAnimationPlayState = "paused";
        }

        // youtube faster
        $scope.generateFrame = function (videoID, fbID, views) {
            // var currVid = firebase.database().ref().child("videos").orderByChild("");
            // var currVid = $firebaseObject(vid.orderByChild("url").equalTo(videoID));
            // console.log(currVid);

            // var vid = firebase.database().ref().child("videos");
            // vid.orderByChild("url").equalTo(videoID).once('value').then(function(snapshot) {
            //     console.log(snapshot.val());
            // });
            //console.log(fbID);
            //console.log($firebaseObject(vid.child(fbID).child('views')));

            console.log(views);
            var newViews = Number(views) + 1;
            firebase.database().ref('/videos/' + fbID + '/views').set(newViews);

            // currVid.$loadd().then(function() {
            //     console.log(currVid.id)
            // })

            // currVid.on('value', function(snapshot) {
            //     console.log(snapshot.value);
            //   //updateStarCount(postElement, snapshot.val());
            // });
             console.log(videoID);
             var iframe = document.createElement("iframe");
             var oldPic = document.getElementById(videoID);
             var oldChild = document.getElementById(videoID + "-child");
             iframe.setAttribute("src", "//www.youtube.com/embed/" + videoID + "?autoplay=1&autohide=2&border=0&wmode=opaque&enablejsapi=1");
             iframe.setAttribute("frameborder", "0");
             iframe.setAttribute("id", "youtube-iframe");
             iframe.setAttribute("width", "350px");
             iframe.setAttribute("height", "197px");
             console.log(oldChild.className);
             iframe.setAttribute("class", oldChild.className);
             //appendChild
             oldPic.replaceChild(iframe, oldChild);
             // var oldPlay = document.getElementById(videoID + "-play");
             // oldPlay.setAttribute("style", "display:none");
        }

        $scope.main.video = {};

        $scope.getLikeData = function(likes, photoFBId) {
            if (likes!=null) {
            console.log("getlikedata");
            var len = Object.keys(likes).length;
            return len;
        }
        else {
            return "not here now";
        }
        }


    $scope.like = function(event, photoFBId, likes) {
      $scope.main.inUse = true;
      console.log("liked");
      console.log(photoFBId);
      var user_id = $cookies.get("userName");
      likes[user_id] = "";
      console.log("new");
      console.log(likes);
      firebase.database().ref('/videos/' + photoFBId + '/likes').set(likes);
      //$scope.getLikeData(likes);
        //$route.reload();
        $scope.main.inUse = false;
    };

    $scope.unlike = function(event, photoFBId, likes) {
      $scope.main.inUse = true;
      console.log("unliked");
      var user_id = $cookies.get("userName");
      console.log("new22");
      console.log(likes);
      delete likes[user_id];
      console.log(likes);
      firebase.database().ref('/videos/' + photoFBId + '/likes').set(likes);
      //$scope.getLikeData(likes);
        //$route.reload();
        $scope.main.inUse = false;
    }
         

    }]);

//work on: adding button to go to profile w/ connecting link --- likes to videos (change schema) --- adding other vids once we have tags --- making all vids page



