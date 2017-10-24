(function() {
	function Mflow() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.messageref={}; ////Messageref;
		this.userattributes=[{name:"",type:"String",value:""}];
	}
	var element = facilis.extend(Mflow, facilis.model.BaseModel);
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

	facilis.model.Mflow = facilis.promote(Mflow, "BaseModel");
}());