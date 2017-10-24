(function() {
	function Timecycle() {
		this.BaseModel_constructor();
		this.unit="Minutes";
		this.value="";
	}
	var element = facilis.extend(Timecycle, facilis.model.BaseModel);
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

	facilis.model.Timecycle = facilis.promote(Timecycle, "BaseModel");
}());