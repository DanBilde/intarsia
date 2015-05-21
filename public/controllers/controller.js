'use strict';

var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function ($scope, $http) {

  console.log('Hello world from controller');

  $scope.product = {};
  $scope.isEditMode = false;

  $scope.refresh = function () {
    $http.get('/api/product')
      .success(function (res) {
        $scope.products = res;
      });
  };

  $scope.addProduct = function () {
    console.log($scope.product);
    $http.post('/api/product', $scope.product)
      .success(function (res) {
        $scope.products.push(res);
        $scope.product = {};
      });
  };

  $scope.removeProduct = function (id) {
    $http.delete('/api/product/' + id)
      .success(function () {
        $scope.products.splice(getDocIdx(id, $scope.products), 1);
      });
  };

  $scope.editProduct = function (id) {
    $scope.product = angular.copy(getDoc(id, $scope.products));
    $scope.isEditMode = true;
  };

  $scope.updateProduct = function () {
    $http.put('/api/product/' + $scope.product._id, $scope.product)
      .success(function (res) {
        $scope.products[getDocIdx($scope.product._id, $scope.products)] =
          res;
        $scope.product = {};
        $scope.isEditMode = false;
      });
  };

  $scope.cancelEdit = function () {
    $scope.product = {};
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
