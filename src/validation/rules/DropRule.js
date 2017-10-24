(function() {

    function DropRule() {
        this.AbstractRule_constructor();
        
		this.dropRules = null;
				
        //private//

        this.setup();
    }
		
	DropRule.rulesXML = facilis.View.getInstance().rootPath+"/rules/dropRules.xml";
	
    //static public//
    
    
    var element = facilis.extend(DropRule, facilis.validation.AbstractRule);
	
	element.validate=function(els) {
		var dropIn = els[0];
			var drop = els[1];
			if (dropIn==drop) {
				return false;
			}
			
			var inName = dropIn.elementType;
			var dropName = drop.elementType;
			var rulesNode = this.dropRules;
			for (var i = 0; i < rulesNode.children.length;i++) {
				if (rulesNode.children[i].getAttribute("from") == inName) {
					var node= rulesNode.children[i];
					for (var u = 0; u < node.children.length; u++ ) {
						if (node.children[u].getAttribute("drop") == dropName) {
							if (dropName == "middleevent" && (inName == "task" || inName == "csubflow")) {
								var lines = facilis.View.getInstance().getLineView().getLinesEndingIn(drop);
								for (var l = 0; l < lines.length ; l++ ) {
									if ((lines[l]).elementType == "sflow") {
										return false;
									}
								}
							}
							return true;
						}
					}
				}
			}
			
			return false;
	}

	element.init=function() {
		var loader = new createjs.XMLLoader( ( new createjs.LoadItem().set({src:facilis.validation.DropRule.rulesXML} )) ) ; //new createjs.LoadQueue(true);

		//loader.addEventListener("fileload", this.loaded.bind(this));
		loader.addEventListener("complete", this.loaded.bind(this));
		loader.load();
		//loader.loadFile(facilis.validation.DropRule.rulesXML);


	};

	element.loaded=function(e){
		//this.elements=e.result.elements;
		this.dropRules=e.result.children[0];
		this.dispatchEvent(new facilis.Event(facilis.validation.AbstractRule.RULE_LODADED));
	}
    
    /*
        element.BaseClassSetup=element.setup;
    */
    element.setup = function() {
        //this.init();
    } ;


    facilis.validation.DropRule = facilis.promote(DropRule, "AbstractRule");
    
}());