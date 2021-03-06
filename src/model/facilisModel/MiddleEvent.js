(function() {
	function MiddleEvent() {
		this.BaseModel_constructor();
		this.attached="TRUE";
		this.documentation="";
		this.name="";
		this.eventtype="Intermediate";
		this.eventdetailtype="None";
		this.catchthrow="CATCH";
	}
	var element = facilis.extend(MiddleEvent, facilis.model.BaseModel);
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
			this.model.watch("catchthrow", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().catchThrowChange((scope.model.catchthrow == ov)?nv:scope.model.catchthrow); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("eventdetailtype");
			this.model.unwatch("catchthrow");
			delete this.model;
		}
	};

	facilis.model.MiddleEvent = facilis.promote(MiddleEvent, "BaseModel");
}());