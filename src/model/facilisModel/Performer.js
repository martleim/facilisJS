(function() {
	function Performer() {
		this.BaseModel_constructor();
		this.name="";
		this.id="";
		this.condition="";
		this.conditionDoc="";
	}
	var element = facilis.extend(Performer, facilis.model.BaseModel);
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

	facilis.model.Performer = facilis.promote(Performer, "BaseModel");
}());