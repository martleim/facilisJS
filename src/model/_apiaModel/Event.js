(function() {
	function Event() {
		this.BaseModel_constructor();
		this.evtName="ONCREATE";
		this.clsName="";
		this.clsDesc="";
	}
	var element = facilis.extend(Event, facilis.model.BaseModel);
	element.setViewModel=function(element){
		this.setBaseViewModel(element);
		element.setModel=function(model) {
			this.model=model;
			var scope=this;
		}
		element.clearModel=function(model) {
			delete this.model;
		}
	};

	facilis.model.Event = facilis.promote(Event, "BaseModel");
}());