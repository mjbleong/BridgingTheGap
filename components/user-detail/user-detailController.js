'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams', '$resource',
  function ($scope, $routeParams, $resource) {
    
    var userId = $routeParams.userId;

    var currUser = $resource('/user/:id', {id: '@id'}, {
        get: {method: 'get', isArray: false}
      });
      currUser.get({id: userId}, function(user) {
        $scope.main.currUser = user;
        var currUserFullName = user.first_name + " " + user.last_name;
        $scope.main.title = 'User Detail of ' + currUserFullName;

        var recentPhoto = $resource('/recent/:id', {id: '@id'}, {
            get: {method: 'get', isArray: false}
          });
        
        var modelObj2 = {id: userId, user: user};
          recentPhoto.save(modelObj2, function(ph) {
            $scope.main.mostRecentPh = ph;
            var date = new Date(ph.date_time);
            $scope.main.date = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
            $scope.main.time = date.getHours() + "hrs and " + date.getMinutes() + "minutes";
          }, function (err) {
            $scope.main.mostRecentPh = null;
        });

          var commentsPhoto = $resource('/mostComments/:id', {id: '@id'}, {
            get: {method: 'get', isArray: false}
          });
        var modelObj = {id: userId, user: user};
          commentsPhoto.save(modelObj, function(ph) {
            $scope.main.mostComPh = ph;
            var dateC = new Date(ph.date_time);
            $scope.main.dateC = dateC.getMonth() + "/" + dateC.getDate() + "/" + dateC.getFullYear();
            $scope.main.timeC = dateC.getHours() + "hrs and " + dateC.getMinutes() + "minutes";
            $scope.main.numCom = ph.comments.length;
            }, function (err) {
            $scope.main.mostComPh = null;
        });

      });


  }]);
