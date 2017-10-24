(function() {
	function Task() {
		this.BaseModel_constructor();
		this.documentation="";
		this.nameChooser={};;
		this.startquantity="1";
		this.completionquantity="1";
		this.completionquantity="1";
		this.activitytype="Task";
		this.performers=[{perfid:"",perfname:"",condition:"",documentation:""}];
		this.hiddenperformers=[{perfid:"",perfname:"",condition:"",documentation:""}];
		this.taskType="User";
		this.looptype="None";
		this.mi_condition="";
		this.loopcounter="";
		this.loopmaximum="";
		this.testtime="After";
		this.mi_ordering="Parallel";
		this.mi_flowcondition="All";
		this.complexmi_flowcondition="";
		this.user={}; ////User;
		this.service={}; ////Service;
		this.receive={}; ////Receive;
		this.send={}; ////Send;
		this.firsttask="false";
		this.role="";
		this.steps=[{step:"step",entityforms:[{id:"",name:"",readonly:"",multiple:"",condition:"",documentation:""}],processforms:[{id:"",name:"",readonly:"",multiple:"",condition:"",documentation:""}]}];
		this.bussinessclasses=[{evtname:"",evtid:"",clsname:"",clsid:"",binding:[{id:"",param:"",type:"",value:"",attribute:"",attributeid:"",inout:"",attributetooltip:""}],skipcondition:""}];
		this.taskstates=[{evtname:"",evtid:"",clsname:"",clsid:"",condition:"",documentation:""}];
		this.proeleid="";
		this.highlightcomments="";
		this.scheduledTask="";
		this.skipcondition="";
		this.userattributes=[{name:"",type:"String",value:""}];
	}
	var element = facilis.extend(Task, facilis.model.BaseModel);
	element.setViewModel=function(element){
		this.setBaseViewModel(element);
		element.setModel=function(model) {
			this.model=model;
			var scope=this;
			this.model.watch("nameChooser", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setName(scope.model.nameChooser); 
					}
				 });
			this.model.watch("activitytype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setDependencyProps(scope.model.activitytype); 
					}
				 });
			this.model.watch("taskType", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().typeChange(scope.model.taskType); 
					}
				 });
			this.model.watch("looptype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().loopTypeChange(scope.model.looptype); 
						scope.getElement().setMultiInMsgs(scope.model.looptype); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("nameChooser");
			this.model.unwatch("activitytype");
			this.model.unwatch("taskType");
			this.model.unwatch("looptype");
			delete this.model;
		}
	};

	facilis.model.Task = facilis.promote(Task, "BaseModel");
}());