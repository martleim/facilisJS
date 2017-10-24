(function() {
	function Send() {
		this.BaseModel_constructor();
		this.messageref={}; ////Messageref;
		this.implementation="WebService";
	}
	var element = facilis.extend(Send, facilis.model.BaseModel);
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

	facilis.model.Send = facilis.promote(Send, "BaseModel");
}());