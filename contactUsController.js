'use strict';

cs142App.controller('ContactUsController', ['$scope', '$routeParams', '$resource', '$http', '$rootScope','$location','$route',
  function ($scope, $routeParams, $resource, $http, $rootScope, $location, $route) {
    $scope.contact.name = '';
    $scope.contact.email = '';
    $scope.contact.message = '';

    $scope.contact.sendMessage = function() {
      var name = $scope.contact.name;
      var email = $scope.contact.email;
      var message = $scope.contact.message;

      firebase.database().ref('messages/' + name + '/' + email + '/' + message).set('');
    }


  }]);