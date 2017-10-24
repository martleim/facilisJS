(function () {
	angular.module('facilisApp').directive('elementproperties', function(facilisConfig, facilisService, $templateRequest, $compile) {
		return {
			templateUrl: facilisConfig.directivesUrl+'elementProperties.html',
			restrict: 'E',
			//transclude: true,
			scope:false,
			link: function(scope, element, attrs) {

				var elementData=angular.element(element[0].querySelectorAll("#elementData"));
				function getElementView(){
					if(!scope.selectedElement){
						return;
					}

					var el=scope.selectedElement;
					var elementView=facilis.getClassName(el);
					var tmpElementData=elementData;
					
					// Load the html through $templateRequest
					$templateRequest(facilisConfig.elementViewsUrl+elementView+".html").then(function(html){
						var template = angular.element(html);
						tmpElementData.html("");
						tmpElementData.append(template);
						$compile(template)(scope);
					});
				}
				
				scope.$watch(
					'selectedElement', 
					 function(newValue, oldValue) {
						 if(newValue!=oldValue)
							getElementView();
				});

				
				getElementView();

			}
		}
		
	});
})()