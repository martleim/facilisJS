(function() {
	function Back() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.bussinessclasses=[{evtname:"",evtid:"",clsname:"",clsid:"",binding:[{id:"",param:"",type:"",value:"",attribute:"",attributeid:"",inout:"",attributetooltip:""}],skipcondition:""}];
		this.protype="C";
	}
	var element = facilis.extend(Back, facilis.model.BaseModel);
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

	facilis.model.Back = facilis.promote(Back, "BaseModel");
}());