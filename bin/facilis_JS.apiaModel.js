(function() {
	function BaseModel() {
		this.subElements=[];
		this.id="";
		this.shape="";
		this.x="";
		this.y="";
		this.width="";
		this.height="";
		this.colorFill="";
		this.documentation="";
		this.viewModel;
	}
	var element = facilis.extend(BaseModel, {});
	
	
	
	element.setBaseViewModel=function(view){
		this.getViewModel().view=view;
		
		view.setModel=function(model) {
			this.model=model;
			var scope=this;
		}
		view.clearModel=function(model) {
			delete this.model;
		}
		
	};
	
	element.getViewModel=function(){
		function ViewModel(model){
			this.model=model;
			this.view=null;
			this.viewModelFunctions=[];
			
			var tmp=this;
			this.observed = function(changes){
				changes.forEach(function(change) {
					// Letting us know what changed
					var func=tmp.viewModelFunctions[change.name];
					if(func)
						func(change.name, change.oldValue, change.object[change.name]);

					//console.log(change.type, change.name, change.oldValue);
				});
			}
			
			Object.observe(this.model, this.observed.bind(this));
		
		}
		if(!this.viewModel){
			this.viewModel=new ViewModel(this);
		}
		return this.viewModel;
	};
	
	element.watch = function(att,func){
		this.getViewModel().viewModelFunctions[att]=func;
	}
	
	element.updateAllBindings=function(){
		for(var i in this.getViewModel().viewModelFunctions)
			try{this.getViewModel().viewModelFunctions[i](i,"",this[i]);}catch(e){}
	}

	facilis.model.BaseModel = facilis.promote(BaseModel, "Object");
}());

(function() {
	function TextAnnotation() {
		this.BaseModel_constructor();
		this.documentation="";
		this.artifacttype="Annotation";
		this.text="";
		this.userattributes=[{name:"",value:"",type:"String"}];
	}
	var element = facilis.extend(TextAnnotation, facilis.model.BaseModel);
	element.setViewModel=function(element){
		this.setBaseViewModel(element);
		element.setModel=function(model) {
			this.model=model;
			var scope=this;
			this.model.watch("text", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setText((scope.model.text == ov)?nv:scope.model.text); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("text");
			delete this.model;
		}
	};

	facilis.model.TextAnnotation = facilis.promote(TextAnnotation, "BaseModel");
}());

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

(function() {
	function SwimLane() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
	}
	var element = facilis.extend(SwimLane, facilis.model.BaseModel);
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
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			delete this.model;
		}
	};

	facilis.model.SwimLane = facilis.promote(SwimLane, "BaseModel");
}());

(function() {
	function StartEvent() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.eventtype="Start";
		this.eventdetailtype="None";
		this.message={}; ////Message;
		this.timer={}; ////Timer;
		this.multiple={}; ////Multiple;
		this.userattributes=[{name:"",type:"String",value:""}];
	}
	var element = facilis.extend(StartEvent, facilis.model.BaseModel);
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
			this.model.watch("eventdetailtype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().typeChange((scope.model.eventdetailtype == ov)?nv:scope.model.eventdetailtype); 
						scope.getElement().setFirstTaskType((scope.model.eventdetailtype == ov)?nv:scope.model.eventdetailtype); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("eventdetailtype");
			delete this.model;
		}
	};

	facilis.model.StartEvent = facilis.promote(StartEvent, "BaseModel");
}());

(function() {
	function Sflow() {
		this.BaseModel_constructor();
		this.conditiondocumentation="";
		this.name="";
		this.conditiontype="None";
		this.conditionexpression="";
		this.apiatype="None";
		this.executionorder="";
		this.userattributes=[{name:"",type:"String",value:""}];
	}
	var element = facilis.extend(Sflow, facilis.model.BaseModel);
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
			this.model.watch("conditiontype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().conditionChange((scope.model.conditiontype == ov)?nv:scope.model.conditiontype); 
					}
				 });
			this.model.watch("apiatype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setApiaType((scope.model.apiatype == ov)?nv:scope.model.apiatype); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("conditiontype");
			this.model.unwatch("apiatype");
			delete this.model;
		}
	};

	facilis.model.Sflow = facilis.promote(Sflow, "BaseModel");
}());

(function() {
	function Pool() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.boundaryvisible="";
		this.Visible="";
		this.process="";
		this.lanes="";
	}
	var element = facilis.extend(Pool, facilis.model.BaseModel);
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
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			delete this.model;
		}
	};

	facilis.model.Pool = facilis.promote(Pool, "BaseModel");
}());

(function() {
	function Performer() {
		this.BaseModel_constructor();
		this.name="";
	}
	var element = facilis.extend(Performer, facilis.model.BaseModel);
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
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			delete this.model;
		}
	};

	facilis.model.Performer = facilis.promote(Performer, "BaseModel");
}());

(function() {
	function MiddleEvent() {
		this.BaseModel_constructor();
		this.attached="TRUE";
		this.documentation="";
		this.name="";
		this.eventtype="Intermediate";
		this.eventdetailtype="None";
		this.message={}; ////Message;
		this.timer={}; ////Timer;
		this.multiple={}; ////Multiple;
		this.userattributes=[{name:"",type:"String",value:""}];
	}
	var element = facilis.extend(MiddleEvent, facilis.model.BaseModel);
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
			this.model.watch("eventdetailtype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().typeChange((scope.model.eventdetailtype == ov)?nv:scope.model.eventdetailtype); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("eventdetailtype");
			delete this.model;
		}
	};

	facilis.model.MiddleEvent = facilis.promote(MiddleEvent, "BaseModel");
}());

(function() {
	function Mflow() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.messageref={}; ////Messageref;
		this.userattributes=[{name:"",type:"String",value:""}];
	}
	var element = facilis.extend(Mflow, facilis.model.BaseModel);
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
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			delete this.model;
		}
	};

	facilis.model.Mflow = facilis.promote(Mflow, "BaseModel");
}());

(function() {
	function Group() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.artifacttype="Group";
		this.userattributes=[{name:"",value:"",type:"String"}];
	}
	var element = facilis.extend(Group, facilis.model.BaseModel);
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
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			delete this.model;
		}
	};

	facilis.model.Group = facilis.promote(Group, "BaseModel");
}());

(function() {
	function Gateway() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.exclusivetype="Data";
		this.gatewaytype="Exclusive";
		this.instantiate="false";
		this.incomingcondition="";
		this.outgoingcondition="";
		this.markervisible="true";
		this.executiontype="Automatic";
		this.userattributes=[{name:"",type:"String",value:""}];
	}
	var element = facilis.extend(Gateway, facilis.model.BaseModel);
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
			this.model.watch("gatewaytype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().typeChange((scope.model.gatewaytype == ov)?nv:scope.model.gatewaytype); 
						scope.getElement().setDependencyProps((scope.model.gatewaytype == ov)?nv:scope.model.gatewaytype); 
					}
				 });
			this.model.watch("executiontype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setExecutionType((scope.model.executiontype == ov)?nv:scope.model.executiontype); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("gatewaytype");
			this.model.unwatch("executiontype");
			delete this.model;
		}
	};

	facilis.model.Gateway = facilis.promote(Gateway, "BaseModel");
}());

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

(function() {
	function Event() {
		this.BaseModel_constructor();
		this.evtName="ONCREATE";
		this.clsName="";
		this.clsDesc="";
	}
	var element = facilis.extend(Event, facilis.model.BaseModel);
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

	facilis.model.Event = facilis.promote(Event, "BaseModel");
}());

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

(function() {
	function EndEvent() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.eventtype="End";
		this.eventdetailtype="None";
		this.message={}; ////Message;
		this.multiple={}; ////Multiple;
		this.userattributes=[{name:"",type:"String",value:""}];
	}
	var element = facilis.extend(EndEvent, facilis.model.BaseModel);
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
			this.model.watch("eventdetailtype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().typeChange((scope.model.eventdetailtype == ov)?nv:scope.model.eventdetailtype); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("eventdetailtype");
			delete this.model;
		}
	};

	facilis.model.EndEvent = facilis.promote(EndEvent, "BaseModel");
}());

(function() {
	function DataStore() {
		this.BaseModel_constructor();
		this.documentation="";
		this.artifacttype="DataStore";
		this.name="";
		this.state="";
		this.capacity="";
		this.isUnlimited="false";
		this.userattributes=[{name:"",value:"",type:"String"}];
	}
	var element = facilis.extend(DataStore, facilis.model.BaseModel);
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
			this.model.watch("state", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setState((scope.model.state == ov)?nv:scope.model.state); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("state");
			delete this.model;
		}
	};

	facilis.model.DataStore = facilis.promote(DataStore, "BaseModel");
}());

(function() {
	function DataOutput() {
		this.BaseModel_constructor();
		this.documentation="";
		this.artifacttype="DataObject";
		this.name="";
		this.state="";
		this.isCollection="false";
		this.userattributes=[{name:"",value:"",type:"String"}];
	}
	var element = facilis.extend(DataOutput, facilis.model.BaseModel);
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
			this.model.watch("state", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setState((scope.model.state == ov)?nv:scope.model.state); 
					}
				 });
			this.model.watch("isCollection", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setCollection((scope.model.isCollection == ov)?nv:scope.model.isCollection); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("state");
			this.model.unwatch("isCollection");
			delete this.model;
		}
	};

	facilis.model.DataOutput = facilis.promote(DataOutput, "BaseModel");
}());

(function() {
	function DataObject() {
		this.BaseModel_constructor();
		this.documentation="";
		this.artifacttype="DataObject";
		this.name="";
		this.state="";
		this.isCollection="false";
		this.userattributes=[{name:"",value:"",type:"String"}];
	}
	var element = facilis.extend(DataObject, facilis.model.BaseModel);
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
			this.model.watch("state", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setState((scope.model.state == ov)?nv:scope.model.state); 
					}
				 });
			this.model.watch("isCollection", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setCollection((scope.model.isCollection == ov)?nv:scope.model.isCollection); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("state");
			this.model.unwatch("isCollection");
			delete this.model;
		}
	};

	facilis.model.DataObject = facilis.promote(DataObject, "BaseModel");
}());

(function() {
	function DataInput() {
		this.BaseModel_constructor();
		this.documentation="";
		this.artifacttype="DataObject";
		this.name="";
		this.state="";
		this.isCollection="false";
	}
	var element = facilis.extend(DataInput, facilis.model.BaseModel);
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
			this.model.watch("state", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setState((scope.model.state == ov)?nv:scope.model.state); 
					}
				 });
			this.model.watch("isCollection", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setCollection((scope.model.isCollection == ov)?nv:scope.model.isCollection); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("state");
			this.model.unwatch("isCollection");
			delete this.model;
		}
	};

	facilis.model.DataInput = facilis.promote(DataInput, "BaseModel");
}());

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

(function() {
	function Association() {
		this.BaseModel_constructor();
		this.documentation="";
		this.name="";
		this.direction="None";
	}
	var element = facilis.extend(Association, facilis.model.BaseModel);
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
			this.model.watch("direction", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setDirection((scope.model.direction == ov)?nv:scope.model.direction); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("direction");
			delete this.model;
		}
	};

	facilis.model.Association = facilis.promote(Association, "BaseModel");
}());

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

(function() {
	function Message() {
		this.BaseModel_constructor();
		this.wsname="";
		this.processattributes=[{id:"",name:"",uk:"",multivalued:""}];
		this.entityattributes=[{id:"",name:"",uk:"",multivalued:""}];
	}
	var element = facilis.extend(Message, facilis.model.BaseModel);
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

	facilis.model.Message = facilis.promote(Message, "BaseModel");
}());

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

(function() {
	function Multimessage() {
		this.BaseModel_constructor();
		this.inmessageref={}; ////Inmessageref;
	}
	var element = facilis.extend(Multimessage, facilis.model.BaseModel);
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

	facilis.model.Multimessage = facilis.promote(Multimessage, "BaseModel");
}());

(function() {
	function Multiple() {
		this.BaseModel_constructor();
		this.message={}; ////Message;
		this.timer=[{timedate:[{value:""}],timecycle:[{value:""}],timeattribute:""}];
	}
	var element = facilis.extend(Multiple, facilis.model.BaseModel);
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

	facilis.model.Multiple = facilis.promote(Multiple, "BaseModel");
}());

(function() {
	function Multitimer() {
		this.BaseModel_constructor();
		this.timedate={}; ////Timedate;
		this.timecycle={}; ////Timecycle;
		this.timeattribute={}; ////Timeattribute;
	}
	var element = facilis.extend(Multitimer, facilis.model.BaseModel);
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

	facilis.model.Multitimer = facilis.promote(Multitimer, "BaseModel");
}());

(function() {
	function Outmessageref() {
		this.BaseModel_constructor();
		this.wsclasses=[{evtname:"",evtid:"",clsname:"",clsid:"",binding:[{id:"",param:"",type:"",value:"",attribute:"",attributeid:"",inout:"",attributetooltip:""}]}];
	}
	var element = facilis.extend(Outmessageref, facilis.model.BaseModel);
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

	facilis.model.Outmessageref = facilis.promote(Outmessageref, "BaseModel");
}());

(function() {
	function Receive() {
		this.BaseModel_constructor();
		this.messageref={}; ////Messageref;
		this.instantiate="false";
		this.implementation="WebService";
	}
	var element = facilis.extend(Receive, facilis.model.BaseModel);
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

	facilis.model.Receive = facilis.promote(Receive, "BaseModel");
}());

(function() {
	function Send() {
		this.BaseModel_constructor();
		this.messageref={}; ////Messageref;
		this.implementation="WebService";
	}
	var element = facilis.extend(Send, facilis.model.BaseModel);
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

	facilis.model.Send = facilis.promote(Send, "BaseModel");
}());

(function() {
	function Service() {
		this.BaseModel_constructor();
		this.inmessageref={}; ////Inmessageref;
		this.outmessageref={}; ////Outmessageref;
		this.implementation="WebService";
	}
	var element = facilis.extend(Service, facilis.model.BaseModel);
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

	facilis.model.Service = facilis.promote(Service, "BaseModel");
}());

(function() {
	function Timeattribute() {
		this.BaseModel_constructor();
		this.timerattribute="";
		this.timerattributetype="P";
	}
	var element = facilis.extend(Timeattribute, facilis.model.BaseModel);
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

	facilis.model.Timeattribute = facilis.promote(Timeattribute, "BaseModel");
}());

(function() {
	function Timecycle() {
		this.BaseModel_constructor();
		this.unit="Minutes";
		this.value="";
	}
	var element = facilis.extend(Timecycle, facilis.model.BaseModel);
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

	facilis.model.Timecycle = facilis.promote(Timecycle, "BaseModel");
}());

(function() {
	function Timedate() {
		this.BaseModel_constructor();
		this.initdate="";
		this.enddate="";
	}
	var element = facilis.extend(Timedate, facilis.model.BaseModel);
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

	facilis.model.Timedate = facilis.promote(Timedate, "BaseModel");
}());

(function() {
	function Timer() {
		this.BaseModel_constructor();
		this.timedate={}; ////Timedate;
		this.timecycle={}; ////Timecycle;
		this.timeattribute={}; ////Timeattribute;
	}
	var element = facilis.extend(Timer, facilis.model.BaseModel);
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

	facilis.model.Timer = facilis.promote(Timer, "BaseModel");
}());

(function() {
	function Transactionref() {
		this.BaseModel_constructor();
		this.transactionid="";
	}
	var element = facilis.extend(Transactionref, facilis.model.BaseModel);
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

	facilis.model.Transactionref = facilis.promote(Transactionref, "BaseModel");
}());

(function() {
	function User() {
		this.BaseModel_constructor();
		this.inmessageref={}; ////Inmessageref;
		this.outmessageref={}; ////Outmessageref;
		this.implementation="WebService";
	}
	var element = facilis.extend(User, facilis.model.BaseModel);
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

	facilis.model.User = facilis.promote(User, "BaseModel");
}());

