(function() {

    function Artifact() {
        this.ElementParser_constructor();
        this.parseFunctions.push(this.getTextAnnotation);
        this.parseFunctions.push(this.getState);
        this.parseFunctions.push(this.getName);
		this.parseFunctions.push(this.getIsCollection);
		this.parseFunctions.push(this.getCapacity);
		this.parseFunctions.push(this.getIsUnlimited);
    }
    
    //static public//
    
    
    var element = facilis.extend(Artifact, facilis.parsers.input.ElementParser);
    
    element.startParse=function(){
        this.callParseFunctions();
        return this.parsedModel;
    }

    element.getTextAnnotation=function() {
        var textannotation = this.toParseNode.getAttribute("TextAnnotation");
        if (textannotation) {
            this.parsedModel.text=textannotation;
        }
    }

    element.getName=function() {
        if (this.toParseNode.getAttribute("Name")) {
            var name = this.toParseNode.getAttribute("Name");
            if (name != null) {
                this.parsedModel.name=name;
            }
        }
    }

    element.getState=function() {
        if (this.toParseNode.firstElementChild) {
            var DataObject = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "DataObject");
            if(DataObject){
                var state = DataObject.getAttribute("State");
                if (state != null) {
                    this.parsedModel.state=state;
                }
            }
        }
    }
	
	element.getIsCollection=function() {
		if (this.toParseNode.firstElementChild) {
			var DataObject;
			if (this.toParseNode.nodeName.indexOf("DataInput") >= 0) {
				DataObject = this.toParseNode;
			/*} else if (toParseNode.nodeName.indexOf("DataOutput") >= 0) {
				DataObject = toParseNode;*/
			} else {
				DataObject = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "DataObject");
			}
			if(DataObject){
				var isCollection = DataObject.getAttribute("IsCollection");
				if (isCollection != null) {
					this.parsedModel.isCollection= isCollection;
				}
			}
		}
	}
	/*
	element.getDataObjectType=function() {
		if (toParseNode.firstElementChild) {
			if (toParseNode.nodeName.indexOf("DataInput") >= 0) {
				setParsedModelValue("dataobjectType", "Input");
			} else if (toParseNode.nodeName.indexOf("DataOutput") >= 0) {
				setParsedModelValue("dataobjectType", "Output");
			} else {
				setParsedModelValue("dataobjectType", "None");
			}
		}
	}
	*/
	element.getCapacity=function() {
		var capacity = this.toParseNode.getAttribute("Capacity");
		if (capacity) {
			this.parsedModel.capacity=capacity;
		}
	}

	element.getIsUnlimited=function() {
		var isUnlimited = this.toParseNode.getAttribute("IsUnlimited");
		if (isUnlimited) {
			this.parsedModel.isUnlimited= isUnlimited;
		}
	}


    facilis.parsers.input.Artifact = facilis.promote(Artifact, "ElementParser");
    
}());