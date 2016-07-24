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

        $scope.main.modalOpen = false;

        $scope.generateFrame = function (urlOrUser, fbID, views, subset) {
            $scope.main.modalOpen = true;
            console.log(fbID);
        if (fbID) {
            var currVid = $firebaseObject(firebase.database().ref().child("videos").child(fbID));
            var currLikes = $firebaseObject(firebase.database().ref().child("videos").child(fbID).child("likes"));
            console.log(currLikes);
            // var currVid2 = $firebaseObject(firebase.database().ref("videos/" + fbID + "/title"));
            $scope.main.currVid = currVid;
            var element = document.getElementById("alum-innerHTML");
            var elementInnerString = "";
            elementInnerString += '<iframe src="//www.youtube.com/embed/' + urlOrUser + '?autoplay=1&amp;autohide=2d&amp;showinfo=0&amp;border=0&amp;wmode=opaque&amp;enablejsapi=1" frameborder="0" width="400px" height="200px" allowfullscreen></iframe>';
            elementInnerString += '<div>' + views +' views</div>';
            element.innerHTML = elementInnerString;
        } else {
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
            //console.log(string);
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
        // $scope.generateFrame = function (videoID, fbID, views, subset) {
        //     console.log("subset:");
        //     console.log(subset);
        //     // var currVid = firebase.database().ref().child("videos").orderByChild("");
        //     // var currVid = $firebaseObject(vid.orderByChild("url").equalTo(videoID));
        //     // console.log(currVid);

        //     // var vid = firebase.database().ref().child("videos");
        //     // vid.orderByChild("url").equalTo(videoID).once('value').then(function(snapshot) {
        //     //     console.log(snapshot.val());
        //     // });
        //     //console.log(fbID);
        //     //console.log($firebaseObject(vid.child(fbID).child('views')));

        //     console.log(views);
        //     var newViews = Number(views) + 1;
        //     firebase.database().ref('/videos/' + fbID + '/views').set(newViews);

        //     // currVid.$loadd().then(function() {
        //     //     console.log(currVid.id)
        //     // })

        //     // currVid.on('value', function(snapshot) {
        //     //     console.log(snapshot.value);
        //     //   //updateStarCount(postElement, snapshot.val());
        //     // });
        //      console.log(videoID);
        //      //var iframe = document.createElement("iframe");
        //      var oldPic = document.getElementById(videoID + "-" + subset);
        //      console.log(oldPic);
        //      var oldChild = document.getElementById(videoID + "-" + subset + "-child");
        //      console.log(oldChild);


        //      // iframe.setAttribute("src", "//www.youtube.com/embed/" + videoID + "?autoplay=1&autohide=2d&showinfo=0&border=0&wmode=opaque&enablejsapi=1");
        //      // iframe.setAttribute("frameborder", "0");
        //      // iframe.setAttribute("class", "youtube-iframe");
        //      // iframe.setAttribute('allowFullScreen', '');


        //      // iframe.setAttribute("width", "350px");
        //      // iframe.setAttribute("height", "197px");
        //      var iframe = '<iframe src="//www.youtube.com/embed/' + videoID + '?autoplay=1&amp;autohide=2d&amp;showinfo=0&amp;border=0&amp;wmode=opaque&amp;enablejsapi=1" frameborder="0" class="random" allowfullscreen=""></iframe>'
        //      console.log(oldChild.className);
        //      //iframe.setAttribute("class", oldChild.className);
        //      //console.log(String(iframe));
        //      // iframe.setAttribute("top", "40px");
        //      //appendChild
        //      //oldPic.replaceChild(iframe, oldChild);
        //      oldPic.innerHTML = iframe;

        //     // var newDiv = document.createElement("div");
        //     // var parent = document.getElementById(videoID + "-" + subset + "-overlayParent");
        //     // var oldDiv = document.getElementById(videoID + "-" + subset + "-overlay");
        //     // parent.replaceChild(newDiv, oldDiv);
        //      // var oldPlay = document.getElementById(videoID + "-play");
        //      // oldPlay.setAttribute("style", "display:none");
        // }

        //$scope.main.video = {};

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


