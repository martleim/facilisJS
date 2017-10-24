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
