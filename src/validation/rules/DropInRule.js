(function() {

    function DropInRule() {
        this.AbstractRule_constructor();
        
		this.dropRules = null;
				
        //private//

        this.setup();
    }
		
	DropInRule.rulesXML = facilis.View.getInstance().rootPath+"/rules/dropInRules.xml";
	
    //static public//
    
    
    var element = facilis.extend(DropInRule, facilis.validation.AbstractRule);
	
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
						return true;
					}
				}
			}
		}
		return false;
	}

	element.init=function() {
		var loader = new createjs.LoadQueue();

		loader.addEventListener("fileload", this.loaded.bind(this));
		loader.loadFile(facilis.validation.DropInRule.rulesXML);


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


    facilis.validation.DropInRule = facilis.promote(DropInRule, "AbstractRule");
    
}());