(function() {
	function Messageref() {
		this.BaseModel_constructor();
		this.wsclasses=[{evtname:"",evtid:"",clsname:"",clsid:"",binding:[{id:"",param:"",type:"",value:"",attribute:"",attributeid:"",inout:"",attributetooltip:""}]}];
	}
	var element = facilis.extend(Messageref, facilis.model.BaseModel);
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

	facilis.model.Messageref = facilis.promote(Messageref, "BaseModel");
}());