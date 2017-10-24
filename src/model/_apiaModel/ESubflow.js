(function() {
	function ESubflow() {
		this.BaseModel_constructor();
		this.documentation="";
		this.subprocesstype="Embedded";
		this.execution="Sync";
		this.transactionref={}; ////Transactionref;
		this.name="";
		this.activitytype="Sub-Process";
		this.looptype="None";
		this.loopcondition="";
		this.mi_condition="";
		this.loopcounter="";
		this.loopmaximum="";
		this.testtime="After";
		this.mi_ordering="Sequential";
		this.mi_flowcondition="All";
		this.complexmi_flowcondition="";
		this.expanded="true";
		this.processforms=[{id:"",name:"",readonly:"",multiple:""}];
		this.entityforms=[{id:"",name:"",readonly:"",multiple:""}];
		this.userattributes=[{name:"",type:"String",value:""}];
	}
	var element = facilis.extend(ESubflow, facilis.model.BaseModel);
	element.setViewModel=function(element){
		this.setBaseViewModel(element);
		element.setModel=function(model) {
			this.model=model;
			var scope=this;
			this.model.watch("name", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setName((scope.model.name == ov)?nv:scope.model.name); 
					}
				 });
			this.model.watch("activitytype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setDependencyProps((scope.model.activitytype == ov)?nv:scope.model.activitytype); 
					}
				 });
			this.model.watch("looptype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().loopTypeChange((scope.model.looptype == ov)?nv:scope.model.looptype); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("activitytype");
			this.model.unwatch("looptype");
			delete this.model;
		}
	};

	facilis.model.ESubflow = facilis.promote(ESubflow, "BaseModel");
}());