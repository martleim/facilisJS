(function() {
	function Multitimer() {
		this.BaseModel_constructor();
		this.timedate={}; ////Timedate;
		this.timecycle={}; ////Timecycle;
		this.timeattribute={}; ////Timeattribute;
	}
	var element = facilis.extend(Multitimer, facilis.model.BaseModel);
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

	facilis.model.Multitimer = facilis.promote(Multitimer, "BaseModel");
}());