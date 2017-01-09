var app = angular.module('fileUpload', ['ngFileUpload'])
.controller('MyCtrl',['$scope','$rootScope','Upload','$window','$http',function($scope,$rootScope,Upload,$window,$http){
    var vm = this;
    $rootScope.authenticated=false;
    vm.submit = function(){ //function to call on form submit
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.upload(vm.file); //call upload function
        }
    }

    vm.logout = function(){
        $rootScope.authenticated =false;
    }


    vm.authenticateUser = function(){
        $http({
            url: 'http://localhost:3000/auth', //webAPI exposed to upload the file
            method:"GET",
            params:{"userId":$scope.userName,"userPassword": $scope.credential}
        }).success(function(res) {
            $rootScope.authenticated = true;
            //access returned res here
        }, function(error) {
            //handle error here
            $rootScope.authenticated =false;
        });
    }
    vm.upload = function (file) {
        Upload.upload({
            url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
            data:{file:file,productName:vm.productName,productPrice:vm.productPrice,
                productDimension:vm.productDimension,productColor:vm.productColor
            } //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data !="" && resp.data != null){ //validate success
                vm.file='';
                $scope.productName='';
                $scope.productPrice='';
                $scope.product_image='';
                $scope.productColor='';
                $scope.productDimension='';
                $scope.productColor='';
                alert("Successfully added the product");
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
}]);