'use strict';

cs142App.controller('AlumController', ['$scope', '$resource', '$firebaseObject', '$location', '$firebaseArray', '$sce', '$stateParams', '$state','$cookies','$route',
    function ($scope, $resource, $firebaseObject, $location, $firebaseArray, $sce, $stateParams, $state, $cookies, $route) {
        $scope.main.title = 'Overfelt Alumni';
        var currUserId = $cookies.get("userName");
        $scope.main.user_id = currUserId;

        // $scope.main.page = $stateParams.page;
        // console.log($stateParams.page);

        var ref = firebase.database().ref().child("users");
        // download the data into a local object
        var userArray = $firebaseArray(ref);
        $scope.main.userArray = userArray;

        var vid = firebase.database().ref().child("videos");
        // download the data into a local object
        var videosArray = $firebaseArray(vid);
        $scope.main.videosArray = videosArray;

        $scope.main.showVidBox = false;

        $scope.main.modalOpen = false;

        // console.log($scope.main.user_id);
        // console.log($scope.main.loggedIn);

        $scope.generateFrame = function (urlOrUser, fbID, views, subset) {
            $scope.main.modalOpen = true;
            console.log(fbID);
            if (fbID) {
                var currVid = $firebaseObject(firebase.database().ref().child("videos").child(fbID));
                var currLikes = $firebaseObject(firebase.database().ref().child("videos").child(fbID).child("likes"));
                console.log(currLikes);
                console.log(views);
                var newViews = Number(views) + 1;
                firebase.database().ref('/videos/' + fbID + '/views').set(newViews);
                // var currVid2 = $firebaseObject(firebase.database().ref("videos/" + fbID + "/title"));
                $scope.main.currVid = currVid;
                $scope.main.currLikes = currLikes;
                var element = document.getElementById("alum-innerHTML");
                var elementInnerString = "";
                elementInnerString += '<iframe src="//www.youtube.com/embed/' + urlOrUser + '?autoplay=1&amp;autohide=2d&amp;showinfo=0&amp;border=0&amp;wmode=opaque&amp;enablejsapi=1" frameborder="0" width="400px" height="200px" allowfullscreen></iframe>';
                elementInnerString += '<div>' + views +' views</div>';
                // if (currLikes[currUserId]==null) {
                //     elementInnerString += '<div><md-button ng-disabled="main.inUse" class="likes" ng-click="like($event, video.$id, video.likes)">Like<md-icon><i class="material-icons">favorite_border</i> </md-icon> </md-button> Click to like.</div>';
                // } else {
                //     elementInnerString += '<div><md-button ng-disabled="main.inUse" class="likes" ng-click="unlike($event, video.$id, video.likes)">Unlike<md-icon><i class="material-icons">favorite</i> </md-icon> </md-button>You liked this.</div>';
                // }
                element.innerHTML = elementInnerString;
                $scope.main.introVideo = false;
            } else {
                $scope.main.introVideo = true;
                var title = document.getElementById("alum-modal-title-forChange");
                title.innerHTML = " " + urlOrUser.firstname + " " + urlOrUser.lastname;
                $scope.main.currVid = {};
                $scope.main.currVid.author_id = urlOrUser.$id;
                var element = document.getElementById("alum-innerHTML");
                element.innerHTML = '<iframe src="//www.youtube.com/embed/' + urlOrUser.intro_url + '?autoplay=1&amp;autohide=2d&amp;showinfo=0&amp;border=0&amp;wmode=opaque&amp;enablejsapi=1" frameborder="0" width="400px" height="200px" allowfullscreen></iframe>';
            }

        }

        $scope.main.findTags = function(tags) {
            if (tags == undefined) { return ""; }
            //console.log(tags["applying-to-college"]);
            var string = "";
            if (tags["applying-to-college"] != undefined) {
                string += " applying-to-college";
            }
            if (tags["finding-community"] != undefined) {
                string += " finding-community";
            }
            if (tags["paying-for-college"] != undefined) {
                string += " paying-for-college";
            }
            if (tags["significant-others"] != undefined) {
                string += " significant-others";
            }
            return string;
        }

        $scope.main.closeClick = function() {
            $scope.main.modalOpen = false;
            var element = document.getElementById("alum-innerHTML");
            element.innerHTML = "";
        }

        $scope.main.seeProfileClick = function(user) {
            $scope.main.modalOpen = false;
            var element = document.getElementById("alum-innerHTML");
            element.innerHTML = "";
            $location.path("/viewProfile/" + user);
        }

        $scope.clickedFace = function (url) {
            $scope.main.showVidBox = true;
            $scope.main.currURL = url;
        }

        $scope.closeVid = function () {
            $scope.main.showVidBox = false;
        }

        // $scope.main.make = function (link) {
        //     console.log("makingvid");
        //     console.log(link);
        //     var youtube = "https://youtube.com/embed/" + link;
        //     var newLink = $sce.trustAsResourceUrl(youtube);
        //     return newLink;
        // }

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
        var recentQuery = firebase.database().ref().child("videos").orderByChild("timestamp").limitToLast(9);
        $scope.main.mostRecArray = $firebaseArray(recentQuery);
        console.log($scope.main.mostRecArray);

        var viewsQuery = firebase.database().ref().child("videos").orderByChild("views").limitToLast(9);
        $scope.main.mostViewsArray = $firebaseArray(viewsQuery);

        var likesQuery = firebase.database().ref().child("videos").orderByChild("num_likes").limitToLast(9);
        $scope.main.mostLikesArray = $firebaseArray(likesQuery);



        $scope.getLikeData = function(likes, photoFBId) {
            if (likes!=null) {
                console.log("getlikedata");
                var len = Object.keys(likes).length;
                return len;
            } else {
                return "not here now";
            }
        }


    $scope.like = function(event, photoFBId, likes, numLikes) {
      $scope.main.inUse = true;
      console.log("liked");
      console.log(photoFBId);
      var user_id = $cookies.get("userName");
      firebase.database().ref('/videos/' + photoFBId + '/likes/' + user_id).set('');
        if (numLikes != null) {
            var newLikes = Number(numLikes) + 1;
            firebase.database().ref('/videos/' + photoFBId + '/num_likes').set(newLikes);
        }
        $scope.main.inUse = false;
    };

    $scope.unlike = function(event, photoFBId, likes, numLikes) {
      $scope.main.inUse = true;
      console.log("unliked");
      var user_id = $cookies.get("userName");
      console.log(likes);
      delete likes[user_id];
      console.log(likes);
      firebase.database().ref('/videos/' + photoFBId + '/likes').set(likes);
        if (numLikes != null) {
            var newLikes = Number(numLikes) - 1;
            firebase.database().ref('/videos/' + photoFBId + '/num_likes').set(newLikes);
        }
            $scope.main.inUse = false;
        };
         

    }]);


