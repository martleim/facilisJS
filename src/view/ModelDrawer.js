(function() {

    function ModelDrawer() {
        this.elements=[];
		this.artifacts=[];
		this.associations=[];
    }
    
    var element = facilis.extend(ModelDrawer, {});
    

    element.drawModel=function(el) {
        this.artifacts = new Array();
        this.associations = new Array();
        this.drawElement(el, null);
        this.drawElements(el, null);
        this.drawLines(el);
        this.drawSubEvents();
        this.drawAssociations();
        for (var i = 0; i < this.artifacts.length; i++ ) {
            if((this.artifacts[i]).elementType!="group"){
                var linesOf = facilis.View.getInstance().getLineView().getLinesOf(this.artifacts[i]);
                if ((!linesOf || (linesOf && linesOf.length == 0)) && !facilis.View.importDisconnectedArtifacts) {
                    (this.artifacts[i]).remove();
                }
            }
        }
    }


    element.drawElements=function(el, parent) {
		
		if (el instanceof facilis.model.BaseModel) {
			var pt = this.drawElement(el, parent);
			if (facilis.getClassName(el).toLowerCase() != "csubflow") {
				this.drawElements(el.subElements, pt);
			}
		}else if(el instanceof Array){
			for (var i = 0; i < el.length; i++ ) {
				if (el[i]) {
					this.drawElements(el[i],parent);
				}
			}
		}
    }

    element.drawLines=function(el) {
		
		if (el instanceof facilis.model.BaseModel) {
			if (el.subElements) {
                this.drawLines(el.subElements);
            }
			if (facilis.getClassName(el).toLowerCase() == "association") {
				this.associations.push(el);
			}else{
				this.drawLine(el);
				//this.drawLines(el);
			}
		}else if(el instanceof Array){
			for (var i = 0; i < el.length; i++ ) {
				if (el[i]) {
					this.drawLines(el[i]);
				}
			}
		}
		
    }

    element.drawAssociations=function() {
        for (var i = 0; i < this.associations.length; i++ ) {
            this.drawLine(this.associations[i]);
        }
    }

    element.dotrace = false;

    element.drawElement=function(el, parent) {
        var name = facilis.getClassName(el).toLowerCase();
        this.dotrace = (name == "task");
        if (name == "task" || name == "csubflow" || name == "startevent" ||
        name == "middleevent" || name == "endevent" || name == "gateway" || 
        name == "datastore" || name == "textannotation" || name == "dataobject" || name == "datainput" || name == "dataoutput" ||
		name == "pool" || name == "esubflow" || name == "group" || (name == "swimlane"  && parent ) ) {
            var className = this.getClassName(name);
            var elem= new facilis.Element(className);
            elem.elementType = name;
            var width= el.width;
            var height = el.height;
            if (name == "pool" || name == "esubflow" || name == "swimlane" || name == "group") {
                var visible = (el.visible != "false");
                if (visible) {
                    facilis.View.getInstance().getLaneView().addElement(elem);
                }else {
                    return null;
                }
                if(width && height){
                    elem.setSize(width, height);
                }
            }else {
				facilis.View.getInstance().getElementView().addElement(elem);
                if (name == "textannotation") {
                    if(width && height){
                        elem.setSize(width, height);
                    }
                }
            }
            var x= parseInt(el.x);
            var y = parseInt(el.y);
            var w = elem.getElement().width;
            var h = elem.getElement().height;
            try {
                w = (elem.getElement()).getRealWidth();
                h = (elem.getElement()).getRealHeight();
            }catch (e) { }
            elem.x = x + parseInt(w / 2);
            elem.y = y + parseInt(h / 2);

            //trace(elem.x+" "+elem.y+" "+(parent?parent.elementType:""));
            if (name == "textannotation" || name == "dataobject" || name == "datainput" || name == "dataoutput" || name == "datastore" || name == "group") {
                this.artifacts.push(elem);
            }
            var data = el;//facilis.clone(el);
            //this.removeSubNodes(data);
            elem.setData(data);

            //elem.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DROP));
            this.elements.push(elem);
            if (parent) {
                //elem.x = parent.x;
                //elem.y = parent.y;
                elem.setContainer(parent);
                if (name == "swimlane") {
                    (parent.getElement()).addInnerElement(elem);
                }
            }else {
                elem.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DROP));
            }
            this.setValues(elem);
            return elem;
        }else if (name == "back") {
            var back = el;//facilis.clone(el);
            //this.removeSubNodes(back);
            facilis.View.getInstance().setMainProcessData(back);
        }
        return null;
    }

    element.removeSubNodes=function(data) {
        if(facilis.getClassName(data).toLowerCase()!="csubflow"){
            if(data.subElements){
                for (var i = (data.subElements.length-1); i >=0 ; i-- ) {
                    if ( facilis.getClassName(data.subElements[i]).toLowerCase() == "pool") {
                        if (data.subElements[i].visible) {
                            data.subElements.splice(i,1);
                        }
                    }else {
                        data.subElements.splice(i,1);
                    }
                }
            }
        }else {
            return;
        }
    }

    element.drawLine=function(el) {
        var start = this.getElement(el.startid);
        var end = this.getElement(el.endid);
        return this.getLineFromVertexes(el, start, end);
    }

    element.getLineFromVertexes=function(el, start, end) {
        var name = facilis.getClassName(el).toLowerCase();
        if (name == "association" || name == "mflow" || name == "sflow") {
            if(start && end){
                start.x = (start.x > 0)?start.x:600;
                start.y = (start.y > 0)?start.y:600;
                end.x = (end.x > 0)?end.x:600;
                end.y = (end.y > 0)?end.y:600;
                var startType = (start).elementType;
                var endType = (end).elementType;
                var startElement=start;
                var endElement = end;
                if (startType == "association" || startType == "mflow" || startType == "sflow") {
                    startElement = (start).middle;
                }
                if (endType == "association" || endType == "mflow" || endType == "sflow") {
                    endElement = (end).middle;
                }
                var line = facilis.View.getInstance().getLineView().addLine(startElement, endElement);
                (startElement).dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_MOVED));
                (endElement).dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_MOVED));
                if (line) {
                    try{
						var data=el;//facilis.clone(el);
                        line.setData(data);
                        this.elements.push(line);
                        line.elementType = name;
                        line.callStartEndFunctions();
                        if (name == "association") {
                            line.setType("dotted");
                        }else if (name == "mflow") {
                            line.setType("dashed");
                            line.setCircle();
                        }else {
                            line.callStartEndFunctions();
                        }
                    }catch(e){}
                    line.elementType = name;
					if (el.vertexes) {
						this.setLineVertexes(line, el.vertexes);
					}
                    this.setValues(line);
                    return line;
                }
            }
        }
    }

    element.setLineVertexes=function(line, vertexes) {
        var start = line.getStartElement();
        if (vertexes.length >= 3) {
            for (var i = 1; i < vertexes.length - 1; i++ ) {
                start=line.addVertex(start, line.getEndElement(), parseInt(vertexes[i].x), parseInt(vertexes[i].y));
            }
        }
    }

    element.drawSubEvents=function() {
        for (var i = 0; i < this.elements.length; i++ ) {
            if ((this.elements[i]).elementType == "middleevent") {
                if((this.elements[i]).getData().isattached == "true") {
                    var target = (this.elements[i]).getData().target;
                    var container = this.getElement(target);
                    //this.elements[i].x = (container.x + (container.width / 2))-30;
                    //this.elements[i].y = (container.y + (container.height / 2)) - 10;
                    (this.elements[i]).setContainer(container);
                }/*else {
                    (this.elements[i]).setContainer(null);
                }*/
            }
        }
    }

    element.getClassName=function(name) {
        var pack = "view.elements.";
        var className = "";
        switch (name){
            case "task":
            className = "TaskElement";
            break;
            case "csubflow":
            className = "CSubFlowElement";
            break;
            case "esubflow":
            className = "ESubFlowElement";
            break;
            case "startevent":
            className = "StartEventElement";
            break;
            case "middleevent":
            className = "MiddleEventElement";
            break;
            case "endevent":
            className = "EndEventElement";
            break;
            case "gateway":
            className = "GatewayElement";
            break;
            case "pool":
            className = "PoolLane";
            break;
            case "group":
            className = "GroupLane";
            break;
            case "swimlane":
            className = "SwimLane";
            break;
            case "textannotation":
            className = "TextAnnotation";
            break;
            case "dataobject":
            className = "DataObject";
            break;
			case "datainput":
			className = "DataInput";
			break;
			case "dataoutput":
			className = "DataOutput";
			break;
			case "datastore":
			className = "DataStore";
			break;
        }

        return facilis[className];//pack + className;

        /*assosiation view.tools.Connector dotted
        mflow view.tools.Connector dashed
        sflow view.tools.Connector*/
    }

    element.getElement=function(id) {
        for (var i = 0; i < this.elements.length; i++ ) {
            var d = (this.elements[i]).getData();
            var e = this.elements;
            var elid = (this.elements[i]).getData().id;
            if (elid == id) {
                return this.elements[i];
            }
        }
    }

    element.setValues=function(el) {
        if(el != null) {
            var data = el.getData();
            /*for (var i = 0; i < data.children.length; i++ ) {
                var node = data.children[i];
                if(node.nodeName=="attGroup"){
                    for (var u = 0; u < node.children.length;u++ ) {
                        this.parseAttribute(el,node.children[u]);
                    }
                }
            }*/
        }
    }

    element.parseAttribute=function(el, att) {
        var type = att.type;
        var change = att.change;
        /*var disable = att.getAttribute("disable");
        var enable = att.getAttribute("enable");*/
        var value = att.value;
		var useLabelName = att.useLabelName;

		if (useLabelName == "true") {
			if (att.children != null && att.children.length > 1) {
				var levels = att.children[1].children[0].children;
				for (var j = 0; j < levels.length; j++) {
					if (levels[j].name == "label") {	
						value = levels[j].value;
						break;
					}
				}
			}
		}
		
        if (att.disabled == "true") {
            return;
        }
        if (type == "combo" || type == "text" || type == "checkbox" || type == "modal" || type == "modalArray" || type == "colorPicker") {
            if (change) {
                try {
					
					var theEl = el;
					if(el && el.getElement && el.getElement())
						theEl=el.getElement()

                    if(change.indexOf(",")<0){
						theEl[change](value);
                        //f(value);
                    }else {
                        var chgs = change.split(",");
                        for (var c = 0; c < chgs.length; c++ ) {
                            //var fnc = el.getElement()[chgs[c]];
                            //fnc(value);
                            theEl[chgs[c]](value);
                        }
                    }
                }catch (e) { }
            }
            var disable = "";
            var enable = "";
            if (type == "combo") {
                var options = att;//.firstChild;
                for (var o = 0; o < options.children.length;o++ ) {
                    if (options.children[o].value == value) {
                        disable = options.children[o].disable;
                        enable = options.children[o].enable;
                        break;
                    }
                }
            }else if (type == "checkbox") {
                disable = (value == "true")?att.getAttribute("disable"):att.getAttribute("enable");
                enable = (value == "true")?att.getAttribute("enable"):att.getAttribute("disable");
            }
            disable = (disable)?disable:"";
            enable = (enable)?enable:"";
            if (disable != "") {
                this.setDisable(disable.split(","), "true", el);
            }
            if (enable != "") {
                this.setDisable(enable.split(","), "false", el);
            }
        }else {
            for (var i = 0; i < att.children.length;i++ ) {
                this.parseAttribute(el, att.children[i]);
            }
        }

    }



    element.setDisable=function(disabledNames,value,el) {
        var node = el.getData();
        var disabled = this.getSubNodesFromNames(node,disabledNames);
        for (var i = 0; i < disabled.length;i++ ) {
            var subNode = disabled[i];
            if (subNode) {
                subNode.setAttribute("disabled", value);
                if (value == "true") {
                    if(subNode.getAttribute("type")!="combo"){
                        subNode.setAttribute("value", "");
                    }/*else {
                        if (subNode.firstChild && subNode.firstChildNode.firstChild) {
                            var cmbValue = "";
                            for (var v = 0; v < subNode.firstChildNode.children.length; v++ ) {
                                if (subNode.firstChildNode.children[v].getAttribute("disabled") != "true") {
                                    cmbValue = subNode.firstChildNode.children[v].getAttribute("value");
                                    break;
                                }
                            }
                            subNode.getAttribute("value") = cmbValue;
                        }
                    }*/
                }
            }
        }
    }

    element.getSubNodesFromNames=function(n, names) {
        var namesObj = new Object();
        for (var i = 0; i < names.length; i++ ) {
            namesObj[names[i]] = true;
        }
        namesObj.subNodesCant = names.length;
        return this.getSubNodes(n, namesObj);
    }

    element.getSubNodes=function(n, names, nodes) {
        if (!nodes) {
            nodes = new Array();
        }
        if (names.subNodesCant == 0) {
            return nodes;
        }
        for (var i = 0; i < n.children.length;i++ ) {
            if (names[(n.children[i]).getAttribute("name")]) {
                names.subNodesCant--;
                nodes.push((n.children[i]));
            }
            if (names[(n.children[i]).nodeName]) {
                names.subNodesCant--;
                nodes.push((n.children[i]));
            }
            var subNodes = [];
            if (n.children[i].getAttribute("type") != "modalArray") {
                subNodes = this.getSubNodes((n.children[i]), names, null);
            }
            if (subNodes.length > 0) {
                nodes=nodes.concat(subNodes);
            }
        }
        /*i = 0;
        for (i = 0; i < n.children.length;i++ ) {
            var subNodes = getSubNodes((n.children[i]), names,nodes);
            if (subNodes.length > 0) {
                nodes=nodes.concat(subNodes);
            }
        }*/
        return nodes;
    }

    element.draw=function(data,parent) {
        if (data.getAttribute("startid") && data.getAttribute("endid")) {
            return this.drawLine(data);
        }else{
            var el = this.drawElement(data, parent);
            return el;
        }
    }


    facilis.ModelDrawer = facilis.promote(ModelDrawer, "Object");
    
}());
