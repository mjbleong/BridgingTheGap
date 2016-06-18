'use strict';

cs142App.controller('UserListController', ['$scope', '$resource',
    function ($scope, $resource) {
        $scope.main.title = 'Users';

	    var UserList = $resource('/user/list', {
	      query: {method: 'get', isArray: true}
	    });

	    UserList.query(function(userList) {
	      $scope.main.userArray = userList;
	    });


    }]);

