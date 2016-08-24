'use strict';

cs142App.controller('GroupsController', ['$scope', '$routeParams', '$resource', '$firebaseArray', '$firebaseObject', '$sce', '$firebaseAuth', '$cookies', '$location', '$route', '$window', '$stateParams',
  function($scope, $routeParams, $resource, $firebaseArray, $firebaseObject, $sce, $firebaseAuth, $cookies, $location, $route, $window, $stateParams) {

  	$scope.group = {};

  	$scope.group.currUser = $cookies.get('userName');

  	$scope.group.videos = {};

  	var currGroup = $stateParams.groupName;

  	firebase.database().ref('groups/' + currGroup + '/videos').once('value').then(function(snapshot) {
  		var videos = snapshot.val();
  		for (var currVid in videos) {
  			firebase.database().ref('videos/' + currVid).once('value').then(function(snapshot) {
  				var oneVideo = snapshot.val();
  				$scope.group.videos[oneVideo.title] = oneVideo;
  				$route.reload();
  			});
  		}
  	})
}]);