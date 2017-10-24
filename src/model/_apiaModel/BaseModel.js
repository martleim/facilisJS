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
	}
	var element = facilis.extend(BaseModel, {});
	
	element.viewModelFunctions={};
	
	element.setBaseViewModel=function(el){
		function ViewModel(view,model){
			this.view=view;
			this.model=model;
			
			this.observation = function(changes){
				var tmp=this;
				changes.forEach(function(change) {
					// Letting us know what changed
					var func=tmp.model.viewModelFunctions[change.name];
					if(func)
						func(change.name, change.oldValue, change.object[change.name]);

					//console.log(change.type, change.name, change.oldValue);
				});
			}
			
			Object.observe(model,this.observation.bind(this));
			
		}
		return new ViewModel(el,this);
		
	};
					   
	element.observation = function(changes){
		var tmp=this;
		changes.forEach(function(change) {
			// Letting us know what changed
			var func=tmp.viewModelFunctions[change.name];
			if(func)
				func(change.name, change.oldValue, change.object[change.name]);

			//console.log(change.type, change.name, change.oldValue);
		});
	}
	
	element.watch = function(att,func){
		this.viewModelFunctions[att]=func;
	}
	
	element.updateAllBindings=function(){
		for(var i in this.viewModelFunctions)
			try{this.viewModelFunctions[i](i,"",this[i]);}catch(e){}
	}

	facilis.model.BaseModel = facilis.promote(BaseModel, "Object");
}());