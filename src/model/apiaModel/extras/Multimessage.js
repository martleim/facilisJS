(function() {
	function Multimessage() {
		this.BaseModel_constructor();
		this.inmessageref={}; ////Inmessageref;
	}
	var element = facilis.extend(Multimessage, facilis.model.BaseModel);
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

	facilis.model.Multimessage = facilis.promote(Multimessage, "BaseModel");
}());