(function() {
	function Transactionref() {
		this.BaseModel_constructor();
		this.transactionid="";
	}
	var element = facilis.extend(Transactionref, facilis.model.BaseModel);
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

	facilis.model.Transactionref = facilis.promote(Transactionref, "BaseModel");
}());