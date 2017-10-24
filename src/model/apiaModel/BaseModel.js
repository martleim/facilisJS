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