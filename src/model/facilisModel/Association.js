(function() {
	function Association() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.direction="None";
	}
	var element = facilis.extend(Association, facilis.model.BaseModel);
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
			this.model.watch("direction", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setDirection((scope.model.direction == ov)?nv:scope.model.direction); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("direction");
			delete this.model;
		}
	};

	facilis.model.Association = facilis.promote(Association, "BaseModel");
}());