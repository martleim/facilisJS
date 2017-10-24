(function() {

    function AbstractRule() {
        this.BaseElement_constructor();
        
        //private//

        this.setup();
    }
	
	AbstractRule.RULE_LODADED 			= "onRuleLoaded";
		
    //static public//
    
    
    var element = facilis.extend(AbstractRule, facilis.BaseElement);
	
	element.init=function(){}
	element.validate=function(els) { return false; }
	element.getPossible=function(el) { return null; }

    
    /*
        element.BaseClassSetup=element.setup;
    */
    element.setup = function() {
        //this.BaseClassSetup();
    } ;


    facilis.validation.AbstractRule = facilis.promote(AbstractRule, "BaseElement");
    
}());

(function() {

    function ConnectionRule() {
        this.AbstractRule_constructor();
        
		this.connRules = null;
				
        //private//

        this.setup();
    }
		
	ConnectionRule.rulesXML = facilis.View.getInstance().rootPath+"/rules/connectionRules.xml";
	
    //static public//
    
    
    var element = facilis.extend(ConnectionRule, facilis.validation.AbstractRule);
	
	element.validate=function(els) {
		try {
			var from = els[0];
			console.log("from: " + from.elementType);
			var to = els[1];
			console.log("to: " + to.elementType);
			var lineType = els[2];
			if (from.elementType != "sflow" && to.elementType != "sflow") {
				if(lineType=="sflow"){
					if (!this.testSamePool((from), (to))) {
						console.log("flag 1");
						return false;
					}
				}
				if (!this.checkMiddle(from, to, lineType)) {
					console.log("flag 2");
					return false;
				}
			}
			console.log("flag 3");
			if ((from == to) || (this.exists(from, to,lineType))) {
				return false;
			}
			console.log("flag 4");
			var fromName = from.elementType;
			var toName = to.elementType;

			var node = this.getRule(fromName);
			if(node.getAttribute("single") && node.getAttribute("single").indexOf(lineType)>=0 && !this.testFromLines(from,lineType) ){
				return false;
			}
			var toRule;
			for (var i = 0; i < node.children.length; i++ ) {
				if (node.children[i].getAttribute("to")==toName) {
					toRule = node.children[i];
					break;
				}
			}
			if (toRule && toRule.getAttribute("valid")) {
				if(toRule.getAttribute("valid").indexOf(lineType)<0){
					return false;
				}
			}
			var multiTo = toRule.getAttribute("multi");
			if (multiTo && (multiTo.indexOf(lineType)>=0)) {

			}else {
				if (!this.testToLines(to, lineType) ) {
					return false;
				}
			}
			return true;
		}catch (e) {
			//console.log(e.getStackconsole.log());

		}
		return false;
	}

	element.getPossible=function(el) {
		var rule = this.getRule(el.elementType);
		var possibles = new Array();
		for (var i = 0; i < rule.children.length; i++ ) {
			var element = rule.children[i];
			var to = element.getAttribute("to");
			var multi = element.getAttribute("multi");
			var valid = element.getAttribute("valid");
			var possible = new Object();
			if (to) {
				possible.to = to;
			}
			if (multi) {
				possible.multi = multi;
			}
			if (valid) {
				possible.valid = valid;
			}
			if (to || multi || valid) {
				possibles.push(possible);
			}
		}
		return possibles; 
	}

	element.init=function() {
		var loader = new createjs.LoadQueue();

        loader.addEventListener("fileload", this.loaded.bind(this));
        loader.loadFile(facilis.validation.ConnectionRule.rulesXML);

        
    };
    
    element.loaded=function(e){
        //this.elements=e.result.elements;
        this.connRules=e.result.children[0];
    	this.dispatchEvent(new facilis.Event(facilis.validation.AbstractRule.RULE_LODADED));
	}

	element.testLoopBack=function(sel, eel, lineType)  {
		if(lineType=="sflow"){
			var endLines = facilis.View.getInstance().getLineView().getLinesEndingIn(sel);
			if (endLines.length) {
				var count = 0;
				for (var l = 0; l < endLines.length;l++ ) {
					if ( "sflow"==(endLines[l]).elementType  && (endLines[l]).getStartElement() == eel  ) {
						count++;
					}						
				}
				/*var startLines = facilis.View.getInstance().getLineView().getLinesEndingIn(sel);
				for (var s = 0; s < startLines.length; s++ ) {
					console.log("(startLines[s]).getStartElement() == eel   "+((startLines[s]).getStartElement() == eel) );
					if (  (startLines[s]).getStartElement() == eel ) {
						count++;
					}
				}*/
				if (count == 1) {
					return true;
				}
			}
		}
		return false;
	}

	element.testFromLines=function(el,lineType) {

		var lines = facilis.View.getInstance().getLineView().getLinesStartingIn(el);
		for (var i = 0; i < lines.length; i++ ) {
			if ( (lines[i]).elementType == lineType ) {
				return false;
			}
		}
		return true;
	}

	element.testToLines=function(el,lineType) {
		var lines = facilis.View.getInstance().getLineView().getLinesEndingIn(el);
		for (var i = 0; i < lines.length; i++ ) {
			if ( (lines[i]).elementType==lineType ){
				return false;
			}
		}
		return true;
	}

	element.getRule=function(fromName){
		var rulesNode = this.connRules.firstElementChild;
		var i = 0;
		var node;
		for (i = 0; i < rulesNode.children.length; i++) {
			if (rulesNode.children[i].getAttribute("from") == fromName) {
				node = rulesNode.children[i];
				break;
			}
		}
		return node;
	}

	element.exists=function(start, end, type) {
		var lines = facilis.View.getInstance().getLineView().getLinesOf(start);
		for (var i = 0; i < lines.length; i++ ) {
			var line = (lines[i]);
			if ( (line.getStartElement() == start && line.getEndElement() == end)  ||
			(  (line.getStartElement() == end && line.getEndElement() == start && type == line.elementType && type != "sflow")  )
			) {
				return true;
			}
		}
		return false;
	}

	element.checkMiddle=function(start, end, type) {
		if (type == "sflow" && end.elementType=="middleevent") {
			var data = end.getData();
			if (data) {
				data = data.firstElementChild;
			}
			for (var i = 0; i < data.children.length; i++ ) {
				if (data.children[i].getAttribute("name") == "attached" && data.children[i].getAttribute("value") == "TRUE" && end.parent) {
					return false;
				}
			}
		}
		if (type == "sflow" && (end.elementType == "middleevent" || start.elementType == "middleevent") ) {
			if (end.elementType == "task" || start.elementType == "task" || end.elementType == "csubflow" || start.elementType == "csubflow" ) {
				if (end.elementType == "middleevent" && (start).containsContent(end)) {
					return false;
				}else if (start.elementType == "middleevent" && (end).containsContent(start)) {
					return false;
				}
			}
		}

		if (start.elementType == "gateway") {
			var d = start.getData().firstElementChild;
			var gType = "";
			for (var e = 0; e < d.children.length; e++ ) {
				if (d.children[e].getAttribute("name")=="gatewaytype") {
					gType = d.children[e].getAttribute("value");
					break;
				}
			}
			/* Cambio 03/04/2014
			if (gType != "Parallel") {
				var linesFrom = facilis.View.getInstance().getLineView().getLinesStartingIn(start);
				if (end.elementType == "middleevent" && linesFrom.length > 0) {
					return false;
				}
				for (i = 0; i < linesFrom.length; i++ ) {
					var line = linesFrom[i];
					var el = line.getEndElement();
					var elType = el.elementType;
					if (elType == "middleevent") {
						return false;
					}
				}
			}
			*/
		}

		return true;
	}

	element.testSamePool=function(start, end) {
		if (!start.parent || !end.parent) {
			return true;
		}
		try{
			if (start.elementType == "middleevent" && (start.getContainer().elementType == "task" || start.getContainer().elementType == "csubflow")) {
				start = start.getContainer();
			}
		}catch (e) { }
		try{
			if (end.elementType == "middleevent" && (end.getContainer().elementType == "task" || end.getContainer().elementType == "csubflow")) {
				end = end.getContainer();
			}
		}catch (e) { }

		if ((start.getContainer() == null && end.getContainer() == null) || (start.getContainer() == end.getContainer())) {
			return true;
		}
		return false;
	}
	
    
    /*
        element.BaseClassSetup=element.setup;
    */
    element.setup = function() {
        //this.init();
    } ;


    facilis.validation.ConnectionRule = facilis.promote(ConnectionRule, "AbstractRule");
    
}());


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

(function() {

    function RuleManager() {
        this.dropRules;
		this.dropInRules;
		this.connectionRules;
		
		this.dropRulesReady = false;
		this.dropInRulesReady = false;
		this.connectionRulesReady = false;
		
    }
	
    RuleManager._instance=null;
    RuleManager.allowInstantiation=false;
    RuleManager.getInstance=function(){
        if (RuleManager._instance == null) {
            RuleManager.allowInstantiation = true;
            RuleManager._instance = new facilis.validation.RuleManager();
			facilis.EventDispatcher.initialize(RuleManager._instance);
            //this._instance.appendMe();
            RuleManager.allowInstantiation = false;
        }
        return RuleManager._instance;
    }
    
    var element = facilis.extend(RuleManager, {});

    element.checkDropRule=function(atts) {
		return this.dropRules.validate(atts);
	}

	element.checkDropInRule=function(atts) {
		return this.dropInRules.validate(atts);
	}

	element.checkConnectRule=function(atts) { 
		return this.connectionRules.validate(atts);
	}

	element.init=function(){

		this.dropRules = new facilis.validation.DropRule();
		this.dropRules.addEventListener(facilis.validation.AbstractRule.RULE_LODADED, this.dropReady.bind(this));
		this.dropInRules = new facilis.validation.DropInRule();
		this.dropInRules.addEventListener(facilis.validation.AbstractRule.RULE_LODADED, this.dropInReady.bind(this));
		this.connectionRules = new facilis.validation.ConnectionRule();
		this.connectionRules.addEventListener(facilis.validation.AbstractRule.RULE_LODADED, this.connectionReady.bind(this));
		
		this.dropInRules.init();
		this.dropRules.init();
		this.connectionRules.init();
	}

	element.getConnectionRules=function() {
		return this.connectionRules;
	}

	element.getDropRules=function() {
		return this.dropRules;
	}

	element.getDropInRules=function() {
		return this.dropInRules;
	}

	element.dropReady=function(e){ 
		this.dropRulesReady = true;
		this.tryRulesReady();
	}

	element.dropInReady=function(e){ 
		this.dropInRulesReady = true;
		this.tryRulesReady();
	}

	element.connectionReady=function(e){
		this.connectionRulesReady = true;
		this.tryRulesReady();
	}

	element.tryRulesReady=function(){
		if (this.dropRulesReady && this.connectionRulesReady && this.dropInRulesReady) {
			this.dispatchEvent(new facilis.Event(facilis.validation.RuleManager.RULES_LOADED));
		}
	}
	
	facilis.validation.RuleManager = facilis.promote(RuleManager, "Object");
    
	facilis.validation.RuleManager.getInstance().init();
}());

