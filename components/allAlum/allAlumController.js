'use strict';

cs142App.controller('AlumController', ['$scope', '$resource', '$firebaseObject', '$location', '$firebaseArray', '$sce', '$stateParams', '$state',
    function ($scope, $resource, $firebaseObject, $location, $firebaseArray, $sce, $stateParams, $state) {
        $scope.main.title = 'Overfelt Alumni';

        $scope.page = $stateParams.page;
        console.log($stateParams.page);

        var ref = firebase.database().ref().child("users");
        // download the data into a local object
        var userArray = $firebaseArray(ref);
        $scope.main.userArray = userArray;

        var vid = firebase.database().ref().child("videos");
        // download the data into a local object
        var videosArray = $firebaseArray(vid);
        $scope.main.videosArray = videosArray;
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

    
        var mostRecOne = null;
        var recentQuery = firebase.database().ref().child("videos").orderByChild("date").limitToLast(1).on("child_added", function(snapshot) {
            mostRecOne = snapshot.val();
            $scope.main.mostRecOne = mostRecOne;
        });

        var mostRecArray = [];
        var recentQuery = firebase.database().ref().child("videos").orderByChild("date").limitToLast(6).on("child_added", function(snapshot) {
            mostRecArray.push(snapshot.val());
            $scope.main.mostRecArray = mostRecArray;
        });

        $scope.goForward = function () {
            var firstThing = document.getElementsByClassName("first")[0];
            var th = false;
            if (firstThing.style.animationName === "bannermove2") {
                                console.log("fene");

                th = true;
            }
            var left = getComputedStyle(firstThing).getPropertyValue("margin-left");
            if (th) {
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

        $scope.stopForward = function () {
            var firstThing = document.getElementsByClassName("first")[0];
            firstThing.style.WebkitAnimationPlayState = "paused";
        }

        $scope.goBackward = function () {
            var firstThing = document.getElementsByClassName("first")[0];
            var th = false;
            if (firstThing.style.animationName === "bannermove") {
                console.log("bene");
                th = true;
            }
            var left = getComputedStyle(firstThing).getPropertyValue("margin-left");
            if (th && left !== "0px") {
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

        $scope.stopBackward = function () {
            var firstThing = document.getElementsByClassName("first")[0];
            firstThing.style.WebkitAnimationPlayState = "paused";
        }


    }]);



