(function() {
	function User() {
		this.BaseModel_constructor();
		this.inmessageref={}; ////Inmessageref;
		this.outmessageref={}; ////Outmessageref;
		this.implementation="WebService";
	}
	var element = facilis.extend(User, facilis.model.BaseModel);
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

	facilis.model.User = facilis.promote(User, "BaseModel");
}());