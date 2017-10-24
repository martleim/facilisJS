(function() {

    function AbstractDocumentator() {
        facilis.EventDispatcher.initialize(this);
        
		this.x = 10000;
		this.y = 10000;
		this.x2 = 0;
		this.y2 = 0;
        
        this.headerImage;
    }
    
    AbstractDocumentator.EXTENDED_DOC = true;
		
		
		
    var element = facilis.extend(AbstractDocumentator, {});
    
    element.getTitle=function() {
        var d = facilis.View.getInstance().getMainProcessData();
		
		if(d)
			return (d.nameChooser || d.name || "");
		
        return "";

    }
    
    element.getMainPoolDoc=function() {
        var d = facilis.View.getInstance().getMainProcessData();
        return this.getDataDocumentation(d);

    }

    element.getElementName=function(el) {
        var d = el.getData();
        if (d) {
            return d.name||d.nameChooser;
        }
        return "";
    }

    element.getElementDocumentation=function(el) {
        var d = el.getData();
        return this.getDataDocumentation(d);
    }
    element.getDataDocumentation=function(d) {
        if (d) {
            var documentationNode=d.documentation;
            var formsNode=(AbstractDocumentator.EXTENDED_DOC)?d.forms:null;
            var eventsNode=(AbstractDocumentator.EXTENDED_DOC)?d.events:null;
            var ttype = d.taskType;
            var tperformers=d.performers;
			return this.getDoc(documentationNode, tperformers, formsNode, eventsNode,ttype);
			
        }
        return "";
    }

    element.getPerformers=function(perfs) {
        var perfomers = new Array();
        if (perfs && perfs.children.length>0) {
            for (var i = 0; i < perfs.children.length; i++ ) {
                if(perfs.children[i].nodeName=="values"){
                    var values = perfs.children[i];
                    for (var v = 0; v < values.children.length; v++ ) {
                        if (values.children[v].firstElementChild && values.children[v].firstElementChild.getAttribute("value") && values.children[v].firstElementChild.getAttribute("value") != "") {
                            perfomers.push(values.children[v].firstElementChild.getAttribute("value"));
                        }
                    }
                }
            }
        }
        return perfomers;
    }

    element.getElementType=function(type) {
        switch(type) {
            case "task":
            type = "Task";
            break;
            case "csubflow":
            type = "Collapsed Sub-Process";
            break;
            case "startevent":
            type = "Start Event";
            break;
            case "middleevent":
            type = "Intermediate Event";
            break;
            case "endevent":
            type = "End Event";
            break;
            case "endevent":
            type = "End Event";
            break;
            case "dataobject":
            type = "Data Object";
            break;
            case "group":
            type = "Group";
            break;
            case "textannotation":
            type = "Text Annotation";
            break;
            case "gateway":
            type = "Gateway";
            break;
            case "pool":
            type = "Pool";
            break;
            case "swimlane":
            type = "Lane";
            break;
            case "sflow":
            type = "Sequence Flow";
            break;
            case "association":
            type = "Association";
            break;
            case "back":
            type = "Workflow Process";
            break;
            default:
            type = "";
            break;
        }
        return type;
    }

    element.getOrder=function(type) {
        var order = 0;
        switch(type) {
            case "back":
            order = 1;
            break;
            case "pool":
            order = -1;
            break;
            case "swimlane":
            order = 0;
            break;
            case "task":
            order = 2;
            break;
            case "csubflow":
            order = 3;
            break;
            case "startevent":
            order = 4;
            break;
            case "middleevent":
            order = 5;
            break;
            case "endevent":
            order = 6;
            break;
            case "endevent":
            order = 7;
            break;
            case "dataobject":
            order = 8;
            break;
            case "group":
            order = 9;
            break;
            case "textannotation":
            order = 10;
            break;
            case "gateway":
            order = 11;
            break;
            case "sflow":
            order = 12;
            break;
            case "association":
            order = 13;
            break;
            default:
            order = 14;
            break;
        }
        return order;
    }

	element.canGenerate=function(){
		
		 return facilis.View.getInstance().getElements().length>0;
		
	}
	
    element.generateImageFile=function() {
        facilis.View.getInstance().unselectAll();
        var elements = facilis.View.getInstance().getElements();
        var actualEl = elements[0];
        x = 10000;
        y = 10000;
        x2 = 0;
        y2 = 0;
        elements = elements.concat(facilis.View.getInstance().getLineView().getElements());
        for (var i = 0; i < elements.length; i++ ) {
            if ((elements[i]) instanceof facilis.LineObject) {
                var l = (elements[i]);
                var lx = l.getLineX();
                var lx2 = lx+l.getLineWidth();
                var ly = l.getLineY();
                var ly2 = ly + l.getLineHeight();
                if (x > lx) {
                    x = lx;
                }
                if (y > ly) {
                    y = ly;
                }
                if (x2 < lx2) {
                    x2 = lx2;
                }
                if (y2 < ly2) {
                    y2 = ly2;
                }
            }else if ((elements[i]).elementType != "swimlane") {
                if (x > elements[i].x-(elements[i]._width/2)) {
                    x = elements[i].x-(elements[i]._width/2);
                }
                if (y > elements[i].y-(elements[i]._height/2)) {
                    y = elements[i].y-(elements[i]._height/2);
                }
                if (x2 < (elements[i].x+(elements[i]._width/2))) {
                    x2 = (elements[i].x+(elements[i]._width/2));
                }
                if (y2 < (elements[i].y+(elements[i]._height/2))) {
                    y2 = (elements[i].y+(elements[i]._height/2));
                }
            }
            elements[i].visible = true;
        }
        var imgWidth = (x2 + 20) - x;
        var imgHeight = (y2 + 40) - y;
        x -= 10;
        y -= 10;

        /*var logo = LibraryManager.getInstance().getInstancedObject("BPMNDesignerLogo");
        facilis.View.getInstance().getElementView().addChild(logo);

        logo.scaleX = .5;
        logo.scaleY = .5;
        if (imgWidtht < logo.width) {
            imgWidtht = logo.width + 30;
        }*/
        
        var b=facilis.View.getInstance()._stage.getBounds();
        //facilis.View.getInstance()._stage.cache(b.x,b.y,b.width,b.height);
        facilis.View.getInstance()._stage.cache(x,y,imgWidth,imgHeight);
        var imgData=facilis.View.getInstance()._stage.getCacheDataURL();
        this.generateDocumentationImage({data:imgData,width:imgWidth,height:imgHeight});
        facilis.View.getInstance()._stage.uncache();
        
    }
    element.generateDocumentationImage=function(img) {
    }

    element.getDoc=function(doc,performers, forms, events, type) {
        var objDoc = { };
        if (doc) {
            objDoc.documentation = doc;
        }
        if (type!="" && type!="None") {
            objDoc.type = type;
        }
        if (performers && performers.length>0) {
            objDoc.performers = performers;
        }
        if (forms) {
            objDoc.forms=this.parseFormsDoc(forms);
        }
        if (events) {
            objDoc.events=this.parseEventDoc(events);
        }
        return objDoc;
    }

    element.addedForms=null;

    element.parseFormsDoc=function(forms) {
        var steps = forms;
        var forms = [];
        if (steps) {
            for (var f = 0; f < steps.length; f++ ) {
                var step = steps[f];
				for(var fs in step){
					if(fs.indexOf("forms")>=0)
                		forms=forms.concat(this.parseFormDoc(step[fs]));
				}
            }
        }
        return forms;
    }

    element.parseFormDoc=function(forms) {
        var ret=[];

		if (forms) {
			for (var f = 0; f < forms.length; f++ ) {
				var form = forms[f];
				form = this.getFormElement(form);
				if (form) {
					var formNode = {};
					formNode.name=form.formName;
					formNode.description=form.formDesc;

					if (form.doc) {
						var docValues=form.doc;
						var attsArray = new Array();
						formNode.documentation=[];
						for (var d = 0; d < docValues.length; d++ ) {
							var fieldDoc = docValues[d];

							formNode.documentation.push({

								name:fieldDoc.fname,
								description:fieldDoc.description,
								datatype:fieldDoc.datatype,
								fieldtype:fieldDoc.fieldtype,
								rules:fieldDoc.rules,
								tooltip:fieldDoc.tooltip,
								grid:fieldDoc.grid 
							}
							);

						}
					}

					var evts = this.parseEventDoc(form.frmEvents);
					if (evts) {
						formNode.events=evts;
					}
					ret.push(formNode);
				}
			}
		}

        return ret;
    }

    element.checkAdded=function(el, forms) {
        var id = el.firstElementChild.getAttribute("value");
        for (var i = 0; i < forms.children.length;i++ ) {
            if (forms.children[i].firstElementChild.getAttribute("value") == id) {
                return true;
            }
        }
        return false;

    }

    element.parseEventDoc=function(events){
		if (events) {
			var ret=[];
			for (var e = 0; e < events.length; e++ ) {
				var event = events[e];
				if (event) {
					
					ret.push({
						name:event.evtName,
						description:event.clsDesc,
						className:event.clsName
						
					});
					
				}
			}
			return ret;
		}

        return null;
    }

    element.getSubNodeValue=function(n,name) {
        var node = this.getSubNode(n, name);
        if (node && node.getAttribute("value") && node.getAttribute("value")!="" && node.getAttribute("value")!=undefined && node.getAttribute("value")!="undefined") {
            return node.getAttribute("value");
        }
        return null;
    }

    element.getSubNode=function(n, name){
        for (var i = 0; i < n.children.length;i++ ) {
            if (((n.children[i]).getAttribute("name")==name || (n.children[i]).nodeName==name) && ( (n.children[i]).getAttribute("disabled") != "true" ) ) {
                return (n.children[i]);
            }
            if (((n.children[i]).getAttribute("name") == name || (n.children[i]).nodeName == name) && ( (n.children[i]).getAttribute("disabled") == "true" ) ) {
                return null;
            }
        }
        i = 0;
        for (i = 0; i < n.children.length; i++ ) {
            if(n.children[i].nodeName!="subElements" && ( (n.children[i]).getAttribute("disabled") != "true" ) ){
                var subNode = this.getSubNode((n.children[i]), name);
                if (subNode) {
                    return subNode;
                }
            }
        }
        return null;
    }

    element.parseMainPoolDoc=function() {
        var mpDoc = this.getMainPoolDoc();
        if (mpDoc && ((mpDoc.documentation && mpDoc.documentation!="" && mpDoc.documentation!="undefined") || mpDoc.events)) {
            var title = this.getTitle();
            var title = ((title && title != "" && title != "undefined")?title:"Unnamed Workflow Process");
            return { elementType:"back", name:title, documentation:mpDoc.documentation, events:mpDoc.events };
        }
    }

    element.sortElements=function(elements) {
        var elAux = new Array();
        for (var i = 0; i < elements.length; i++ ) {
            var elType = (elements[i]).elementType;
            var name = this.getElementName((elements[i]));
            var doc = this.getElementDocumentation((elements[i]));
            var docObj = { elementType:elType, name:name };
            if (doc && (doc.documentation || doc.forms || doc.events) && name!="") {
                if(doc.documentation){
                    docObj.documentation = doc.documentation;
                }
                if (doc.forms) {
                    docObj.forms = doc.forms;
                }
                if (doc.events) {
                    docObj.events = doc.events;
                }
                if (doc.type) {
                    docObj.type = doc.type;
                }
                if (doc.performers) {
                    docObj.performers = doc.performers;
                }
                if ((docObj.documentation && docObj.documentation != "" && (docObj.documentation + "" != "undefined")) || docObj.forms || docObj.events){
                    elAux.push( docObj );
                }
            }
        }
        var tmp=this;
        elAux.sort(function(a, b) {
            if (tmp.getOrder(a.elementType) == tmp.getOrder(b.elementType)) {
                return (a.name.localeCompare(b.name));
            }
            return (tmp.getOrder(a.elementType)-tmp.getOrder(b.elementType));
        } );
        return elAux;
    }

    element.testDocumentation=function() {
        if (facilis.View.getInstance().getElements().length == 0) {
            var mpDoc = this.getMainPoolDoc();
            if (mpDoc && (mpDoc.documentation || mpDoc.events)) {
                return true;
            }
            return false;
        }
        return true;
    }

    element.setHeaderImage=function(img) {
        headerImage = img;
    }


    element.getFormElement=function(frm) {
        var id = frm.formId;
        var form = facilis.controller.FormResources.getInstance().getResource(id);
        if (form) {
            return facilis.clone(form,true);
        }
        return null;
    }
    
    

    facilis.documentation.AbstractDocumentator = facilis.promote(AbstractDocumentator, "Object");
    
}());