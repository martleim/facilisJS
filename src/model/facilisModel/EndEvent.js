(function() {
	function EndEvent() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.eventtype="End";
		this.eventdetailtype="None";
	}
	var element = facilis.extend(EndEvent, facilis.model.BaseModel);
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
			this.model.watch("eventdetailtype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().typeChange((scope.model.eventdetailtype == ov)?nv:scope.model.eventdetailtype); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("eventdetailtype");
			delete this.model;
		}
	};

	facilis.model.EndEvent = facilis.promote(EndEvent, "BaseModel");
}());