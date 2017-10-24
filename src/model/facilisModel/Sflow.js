(function() {
	function Sflow() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.conditiontype="None";
		this.conditionexpression="";
		this.apiatype="None";
	}
	var element = facilis.extend(Sflow, facilis.model.BaseModel);
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
			this.model.watch("conditiontype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().conditionChange((scope.model.conditiontype == ov)?nv:scope.model.conditiontype); 
					}
				 });
			this.model.watch("apiatype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setApiaType((scope.model.apiatype == ov)?nv:scope.model.apiatype); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("conditiontype");
			this.model.unwatch("apiatype");
			delete this.model;
		}
	};

	facilis.model.Sflow = facilis.promote(Sflow, "BaseModel");
}());