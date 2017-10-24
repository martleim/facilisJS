(function () {
	angular.module('facilisApp').directive('fileactions', function(facilisConfig) {
		return {
			templateUrl: facilisConfig.directivesUrl+'fileActions.html',
			link:function(scope, element, attrs) {
			
				scope.onFileSelected=function(e){
					var clickableElement=e.currentTarget.parentNode;
					var _scope=this;
					var fr = new FileReader();
					var files=e.target.files;
					if(files.length){
					var fr = new FileReader();
					fr.onload = function(e) {
						_scope.loadedXpdl = fr.result;
						angular.element(clickableElement).triggerHandler('click');
					}
					fr.readAsText(files[0],"utf-8");
					}

				}
				
				element.find("input").on("change", scope.onFileSelected.bind(scope));
				element.find("input").on("click", function(e){
					e.stopPropagation();
				});
			}
		};
	});
})()
