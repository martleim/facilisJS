(function () {

    var facilisService = function ($rootScope) {
        
        var service = {
            
        };

		service.selectedElements=[];
		service.selectedElement={};
		
		service.loadStringXPDL=function(xpdl){
			facilis.View.getInstance().loadModelString(xpdl);
		}
		
		service.onElementSelected=function(e){
			service.selectedElements=null;
			service.selectedElements=[];
			
			var newSelection=facilis.View.getInstance().getSelectedElements();
			service.selectedElements.push.apply(service.selectedElements, newSelection);
			if(service.selectedElements.length==1){
				service.selectedElement=service.selectedElements[0].getData();
			}else{
				service.selectedElement=null;
			}
			$rootScope.$apply();
		}
		
		service.getSelectedElement=function(){
			return service.selectedElement;
		}
        
		facilis.View.getInstance().addEventListener(facilis.View.ON_SELECT, service.onElementSelected.bind(service));
		
        return service;
    };

    facilisService.$inject = ["$rootScope"];

    angular.module("facilisApp").factory("facilisService", facilisService);

}());

