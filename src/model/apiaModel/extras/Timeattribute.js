(function() {
	function Timeattribute() {
		this.BaseModel_constructor();
		this.timerattribute="";
		this.timerattributetype="P";
	}
	var element = facilis.extend(Timeattribute, facilis.model.BaseModel);
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

	facilis.model.Timeattribute = facilis.promote(Timeattribute, "BaseModel");
}());