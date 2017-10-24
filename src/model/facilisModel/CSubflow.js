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