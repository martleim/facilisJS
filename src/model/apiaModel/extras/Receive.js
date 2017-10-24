(function() {
	function Receive() {
		this.BaseModel_constructor();
		this.messageref={}; ////Messageref;
		this.instantiate="false";
		this.implementation="WebService";
	}
	var element = facilis.extend(Receive, facilis.model.BaseModel);
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

	facilis.model.Receive = facilis.promote(Receive, "BaseModel");
}());