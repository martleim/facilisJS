(function() {
	function Performer() {
		this.BaseModel_constructor();
		this.name="";
	}
	var element = facilis.extend(Performer, facilis.model.BaseModel);
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

	facilis.model.Performer = facilis.promote(Performer, "BaseModel");
}());