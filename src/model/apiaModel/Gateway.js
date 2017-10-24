(function() {
	function Gateway() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.exclusivetype="Data";
		this.gatewaytype="Exclusive";
		this.instantiate="false";
		this.incomingcondition="";
		this.outgoingcondition="";
		this.markervisible="true";
		this.executiontype="Automatic";
		this.userattributes=[{name:"",type:"String",value:""}];
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
			this.model.watch("executiontype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setExecutionType((scope.model.executiontype == ov)?nv:scope.model.executiontype); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("gatewaytype");
			this.model.unwatch("executiontype");
			delete this.model;
		}
	};

	facilis.model.Gateway = facilis.promote(Gateway, "BaseModel");
}());