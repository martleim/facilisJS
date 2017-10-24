(function() {
	function Timer() {
		this.BaseModel_constructor();
		this.timedate={}; ////Timedate;
		this.timecycle={}; ////Timecycle;
		this.timeattribute={}; ////Timeattribute;
	}
	var element = facilis.extend(Timer, facilis.model.BaseModel);
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

	facilis.model.Timer = facilis.promote(Timer, "BaseModel");
}());