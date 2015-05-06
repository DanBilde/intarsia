'use strict';

var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function ($scope, $http) {

  console.log('Hello world from controller');

  $scope.contact = {};
  $scope.isEditMode = false;

  $scope.refresh = function () {
    $http.get('/api/contact')
      .success(function (res) {
        $scope.contactlist = res;
      });
  };

  $scope.addContact = function () {
    console.log($scope.contact);
    $http.post('/api/contact', $scope.contact)
      .success(function (res) {
        $scope.contactlist.push(res);
        $scope.contact = {};
      });
  };

  $scope.removeContact = function (id) {
    $http.delete('/api/contact/' + id)
      .success(function () {
        $scope.contactlist.splice(getDocIdx(id, $scope.contactlist), 1);
      });
  };

  $scope.editContact = function (id) {
    $scope.contact = angular.copy(getDoc(id, $scope.contactlist));
    $scope.isEditMode = true;
  };

  $scope.updateContact = function () {
    $http.put('/api/contact/' + $scope.contact._id, $scope.contact)
      .success(function (res) {
        $scope.contactlist[getDocIdx($scope.contact._id, $scope.contactlist)] =
          res;
        $scope.contact = {};
        $scope.isEditMode = false;
      });
  };

  $scope.cancelEdit = function () {
    $scope.contact = {};
    $scope.isEditMode = false;
  };

  $scope.refresh();

  function getDoc(id, collection) {
    for (var i = collection.length - 1; i >= 0; i--) {
      if (collection[i]._id === id)
        return collection[i];
    }
  }

  function getDocIdx(id, collection) {
    for (var i = collection.length - 1; i >= 0; i--) {
      if (collection[i]._id === id)
        return i;
    }
  }
}]);
