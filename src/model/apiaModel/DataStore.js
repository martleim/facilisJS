(function() {
	function DataStore() {
		this.BaseModel_constructor();
		this.documentation="";
		this.artifacttype="DataStore";
		this.name="";
		this.state="";
		this.capacity="";
		this.isUnlimited="false";
		this.userattributes=[{name:"",value:"",type:"String"}];
	}
	var element = facilis.extend(DataStore, facilis.model.BaseModel);
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
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("state");
			delete this.model;
		}
	};

	facilis.model.DataStore = facilis.promote(DataStore, "BaseModel");
}());