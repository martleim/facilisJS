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