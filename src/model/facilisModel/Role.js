(function() {
	function Role() {
		this.BaseModel_constructor();
		this.name="";
		this.id="";
	}
	var element = facilis.extend(Role, facilis.model.BaseModel);
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

	facilis.model.Role = facilis.promote(Role, "BaseModel");
}());