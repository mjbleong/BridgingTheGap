'use strict';

cs142App.controller('UserListController', ['$scope', '$resource', '$firebaseObject',
    function ($scope, $resource, $firebaseObject) {
        $scope.main.title = 'Users';
        var ref = firebase.database().ref();
        // download the data into a local object
        var testObject = $firebaseObject(ref);
        $scope.main.testObj = testObject;

	    var UserList = $resource('/user/list', {
	      query: {method: 'get', isArray: true}
	    });

	    UserList.query(function(userList) {
	      $scope.main.userArray = userList;
	    });


    }]);

