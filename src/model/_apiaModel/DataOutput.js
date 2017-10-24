(function() {
	function DataOutput() {
		this.BaseModel_constructor();
		this.documentation="";
		this.artifacttype="DataObject";
		this.name="";
		this.state="";
		this.isCollection="false";
		this.userattributes=[{name:"",value:"",type:"String"}];
	}
	var element = facilis.extend(DataOutput, facilis.model.BaseModel);
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
			this.model.watch("state", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setState((scope.model.state == ov)?nv:scope.model.state); 
					}
				 });
			this.model.watch("isCollection", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setCollection((scope.model.isCollection == ov)?nv:scope.model.isCollection); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("state");
			this.model.unwatch("isCollection");
			delete this.model;
		}
	};

	facilis.model.DataOutput = facilis.promote(DataOutput, "BaseModel");
}());