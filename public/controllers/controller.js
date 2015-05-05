'use strict';

var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function ($scope, $http) {

  console.log("Hello world from controller");

  var refresh = function () {
    $http.get('/api/contact')
      .success(function (res) {
        $scope.contactlist = res;
      });
  };

  refresh();

  $scope.addContact = function () {
    console.log($scope.contact);
    $http.post('/api/contact', $scope.contact)
      .success(function (res) {
        $scope.contactlist.push(res);
      });
  };

  $scope.removeContact = function (id) {
    $http.delete('/api/contact/' + id)
      .success(function () {
        for (var i = $scope.contactlist.length - 1; i >= 0; i--) {
          if ($scope.contactlist[i]._id === id)
            $scope.contactlist.splice(i, 1);
        }
      });
  };

}]);
