(function() {
	function Form() {
		this.BaseModel_constructor();
		this.formId="";
		this.formName="";
		this.formDesc="";
		this.doc=[{fname:"",description:"",fieldtype:"Input",datatype:"String",grid:"",rules:""}];
		this.frmEvents=[{evtName:"ONLOAD",clsName:"",clsDesc:""}];
	}
	var element = facilis.extend(Form, facilis.model.BaseModel);
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

	facilis.model.Form = facilis.promote(Form, "BaseModel");
}());