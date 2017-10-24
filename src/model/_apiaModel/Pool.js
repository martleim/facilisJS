(function() {
	function Pool() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.boundaryvisible="";
		this.Visible="";
		this.process="";
		this.lanes="";
	}
	var element = facilis.extend(Pool, facilis.model.BaseModel);
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
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			delete this.model;
		}
	};

	facilis.model.Pool = facilis.promote(Pool, "BaseModel");
}());