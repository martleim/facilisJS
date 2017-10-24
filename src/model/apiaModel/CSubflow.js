(function() {
	function CSubflow() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name={};;
		this.subprocesstype="Embedded";
		this.transaction="false";
		this.activitytype="Sub-Process";
		this.looptype="None";
		this.loopcondition="";
		this.loopdocumentation="";
		this.mi_condition="";
		this.loopcounter="";
		this.loopmaximum="";
		this.testtime="After";
		this.mi_ordering="Parallel";
		this.mi_flowcondition="All";
		this.complexmi_flowcondition="";
		this.firsttask="false";
		this.entity="";
		this.processforms=[{id:"",name:""}];
		this.entityforms=[{id:"",name:""}];
		this.execution="SYNCHR";
		this.skipfirsttask="false";
	}
	var element = facilis.extend(CSubflow, facilis.model.BaseModel);
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
			this.model.watch("subprocesstype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().typeChange((scope.model.subprocesstype == ov)?nv:scope.model.subprocesstype); 
					}
				 });
			this.model.watch("transaction", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().transactionChange((scope.model.transaction == ov)?nv:scope.model.transaction); 
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
			this.model.unwatch("subprocesstype");
			this.model.unwatch("transaction");
			this.model.unwatch("activitytype");
			this.model.unwatch("looptype");
			delete this.model;
		}
	};

	facilis.model.CSubflow = facilis.promote(CSubflow, "BaseModel");
}());