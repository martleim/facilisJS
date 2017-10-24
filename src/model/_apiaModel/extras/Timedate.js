(function() {
	function Timedate() {
		this.BaseModel_constructor();
		this.initdate="";
		this.enddate="";
	}
	var element = facilis.extend(Timedate, facilis.model.BaseModel);
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

	facilis.model.Timedate = facilis.promote(Timedate, "BaseModel");
}());