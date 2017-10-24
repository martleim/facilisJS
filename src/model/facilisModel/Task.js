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