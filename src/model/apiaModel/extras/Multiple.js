(function() {
	function Multiple() {
		this.BaseModel_constructor();
		this.message={}; ////Message;
		this.timer=[{timedate:[{value:""}],timecycle:[{value:""}],timeattribute:""}];
	}
	var element = facilis.extend(Multiple, facilis.model.BaseModel);
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

	facilis.model.Multiple = facilis.promote(Multiple, "BaseModel");
}());