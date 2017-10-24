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
		this.nameChooser="DEFAULT_TASK";
		this.name="DEFAULT_TASK";
		this.colorFill="";
		this.taskType="User";
		this.looptype="None";
		this.mi_condition="";
		this.skipcondition="";
		this.performers=[{perfname:""}];
		this.forms={}; ////Forms;
		this.events=[{evtName:"ONREADY",clsName:"",clsDesc:""}];
		this.firsttask="false";
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
						scope.getElement().setName((scope.model.nameChooser == ov)?nv:scope.model.nameChooser); 
					}
				 });
			this.model.watch("name", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setName((scope.model.name == ov)?nv:scope.model.name); 
					}
				 });
			this.model.watch("colorFill", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setColor((scope.model.colorFill == ov)?nv:scope.model.colorFill); 
					}
				 });
			this.model.watch("taskType", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().typeChange((scope.model.taskType == ov)?nv:scope.model.taskType); 
					}
				 });
			this.model.watch("looptype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().loopTypeChange((scope.model.looptype == ov)?nv:scope.model.looptype); 
						scope.getElement().setMultiInMsgs((scope.model.looptype == ov)?nv:scope.model.looptype); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("nameChooser");
			this.model.unwatch("name");
			this.model.unwatch("colorFill");
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
		this.documentation="";
		this.name="";
		this.conditiontype="None";
		this.conditionexpression="";
		this.apiatype="None";
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
		this.id="";
		this.condition="";
		this.conditionDoc="";
	}
	var element = facilis.extend(Performer, facilis.model.BaseModel);
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
		this.catchthrow="CATCH";
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
			this.model.watch("catchthrow", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().catchThrowChange((scope.model.catchthrow == ov)?nv:scope.model.catchthrow); 
					}
				 });
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("eventdetailtype");
			this.model.unwatch("catchthrow");
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
		}
		element.clearModel=function(model) {
			this.model.unwatch("name");
			this.model.unwatch("gatewaytype");
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
		this.iteratecondition="";
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
		this.name="DEFAULT_PROCESS";
		this.colorFill="";
		this.subprocesstype="Embedded";
		this.looptype="None";
		this.loopcondition="";
		this.mi_condition="";
		this.testtime="After";
		this.mi_ordering="Parallel";
		this.mi_flowcondition="All";
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
			this.model.watch("colorFill", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().setColor((scope.model.colorFill == ov)?nv:scope.model.colorFill); 
					}
				 });
			this.model.watch("subprocesstype", 
				function(id, ov, nv) { 
					if(nv!=ov){ 
						scope.getElement().typeChange((scope.model.subprocesstype == ov)?nv:scope.model.subprocesstype); 
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
			this.model.unwatch("colorFill");
			this.model.unwatch("subprocesstype");
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

