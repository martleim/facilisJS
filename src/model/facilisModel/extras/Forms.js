(function() {
	function Forms() {
		this.BaseModel_constructor();
	}
	var element = facilis.extend(Forms, facilis.model.BaseModel);
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

	facilis.model.Forms = facilis.promote(Forms, "BaseModel");
}());