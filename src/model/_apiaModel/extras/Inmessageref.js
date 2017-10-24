(function() {
	function Inmessageref() {
		this.BaseModel_constructor();
		this.wsname="";
		this.processattributes=[{id:"",name:"",uk:"",multivalued:""}];
		this.entityattributes=[{id:"",name:"",uk:"",multivalued:""}];
	}
	var element = facilis.extend(Inmessageref, facilis.model.BaseModel);
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

	facilis.model.Inmessageref = facilis.promote(Inmessageref, "BaseModel");
}());