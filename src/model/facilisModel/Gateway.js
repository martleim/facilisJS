(function() {
	function Gateway() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.exclusivetype="Data";
		this.gatewaytype="Exclusive";
		this.instantiate="false";
	}
	var element = facilis.extend(Gateway, facilis.model.BaseModel);
	element.setViewModel=function(element){
		this.setBaseViewModel(element);
		element.setModel=function(model) {
			this.model=model;
			var scope=this;
			this.model.watch("name", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setName((scope.model.name == ov)?nv:scope.model.name); 
					}
				 });
			this.model.watch("gatewaytype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().typeChange((scope.model.gatewaytype == ov)?nv:scope.model.gatewaytype); 
						scope.getElement().setDependencyProps((scope.model.gatewaytype == ov)?nv:scope.model.gatewaytype); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("gatewaytype");
			delete this.model;
		}
	};

	facilis.model.Gateway = facilis.promote(Gateway, "BaseModel");
}());