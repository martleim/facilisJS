(function () {

    var ElementPropertiesController = function ($scope, facilisService) {
        $scope.selectedElement=null;
		
		$scope.$watch(
			function() { 
				return facilisService.selectedElement; 
			}, 
			 function(newValue, oldValue) {
				 if(newValue!=oldValue){
				 	$scope.selectedElement=newValue;
					 $scope.$apply;
				 }
		});

    };

    ElementPropertiesController.$inject = ["$scope", "facilisService"];

    angular.module("facilisApp").controller("ElementPropertiesController", ElementPropertiesController);

}());