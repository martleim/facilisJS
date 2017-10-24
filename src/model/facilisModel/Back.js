(function() {
	function Back() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.events=[{evtName:"ONCREATE",clsName:"",clsDesc:""}];
		this.forms=[{formId:"",formName:"",formDesc:"",doc:[{fname:"",description:"",fieldtype:"Input",datatype:"String",grid:"",rules:""}],frmEvents:[{evtName:"ONLOAD",clsName:"",clsDesc:""}]}];
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