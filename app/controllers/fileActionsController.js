(function () {

    var FileActionsController = function ($scope, facilisService) {
        
		 this.load=function(){
			 facilisService.loadStringXPDL($scope.loadedXpdl);
		 }
		 
		 
    };

    FileActionsController.$inject = ["$scope", "facilisService"];

    angular.module("facilisApp").controller("FileActionsController", FileActionsController);

}());