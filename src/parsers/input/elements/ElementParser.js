(function() {

    function ElementParser() {
        this.parsedModel=null;
		this.toParseNode=null;
        
        this.parseFunctions = [];
        this.parseFunctions.push(this.getId);
        this.parseFunctions.push(this.getName);
        this.parseFunctions.push(this.getDocumentation);
        this.parseFunctions.push(this.parseCategories);
        this.parseFunctions.push(this.parseDataFields);
        //this.parseFunctions.push(this.parseProperties);
        this.parseFunctions.push(this.parseUserAttributes);
        this.parseFunctions.push(this.getNodeGraphicsInfo);
    }
    
    //static public//
    
    
    var element = facilis.extend(ElementParser, {});

    element.getNodeGraphicsInfo=function() {
        var NodeGraphicsInfos = this.getToParseSubNode("NodeGraphicsInfos");
        var NodeGraphicsInfo;
        if (NodeGraphicsInfos && NodeGraphicsInfos.firstElementChild) {
            NodeGraphicsInfo = NodeGraphicsInfos.firstElementChild;
            this.parseNodeGraphicsInfo(NodeGraphicsInfo);
        }else {
            NodeGraphicsInfo = this.getToParseSubNode("NodeGraphicsInfo");
            if(NodeGraphicsInfo){
                this.parseNodeGraphicsInfo(NodeGraphicsInfo);
            }
        }
    }

    element.parseNodeGraphicsInfo=function(NodeGraphicsInfo) {
        var width = NodeGraphicsInfo.getAttribute("Width");
        var height = NodeGraphicsInfo.getAttribute("Height");
        var x = 0;
        var y = 0;
        if (NodeGraphicsInfo.firstElementChild) {
            x = NodeGraphicsInfo.firstElementChild.getAttribute("XCoordinate");
            y = NodeGraphicsInfo.firstElementChild.getAttribute("YCoordinate");
        }
        this.parsedModel.x= (x?x:"0");
        this.parsedModel.y= (y?y:"0");
        this.parsedModel.width= (width?width:"0");
        this.parsedModel.height= (height?height:"0");
        var shape = NodeGraphicsInfo.getAttribute("Shape");
        if (shape) {
            this.parsedModel.shape= shape;
        }
        this.getColor(NodeGraphicsInfo);
    }

    element.getColor=function(NodeGraphicsInfo) {
        var fillColor = NodeGraphicsInfo.getAttribute("FillColor");
        if(fillColor && this.parsedModel.colorFill){
        	this.parsedModel.colorFill= fillColor;
        }
    }

    element.getName=function() {
        var name = this.toParseNode.getAttribute("Name")||"";
        if(this.parsedModel && name!=null){
			if(this.parsedModel.nameChooser!=null)
				this.parsedModel.nameChooser=name
				
			if(this.parsedModel.name!=null)
				this.parsedModel.name=name

        }
    }

    element.getId=function() {
        var id = this.toParseNode.getAttribute("Id");
        if (id != null) {
            this.parsedModel.id= id;
        }
    }

    element.parse=function(node) {
        this.toParseNode = node;
        return this.startParse();
    }

    element.setParsedModel=function(node) {
        this.parsedModel = node;
    }

    element.getToParseSubNode=function(name,fromNode){
        return facilis.parsers.ParseInUtils.getSubNode((fromNode||this.toParseNode), name);
    }

    element.getParsedSubNode=function(name){
		console.log("FIX getParsedSubNode ATTRIBUTE "+name)
        return facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, name);
    }
	
	element.setParsedModelValue=function(name, value){
		if(this.parsedModel[name] && value)
			this.parsedModel[name]=value;
    }

    element.getToParseSubNodeValue=function(name){
        return facilis.parsers.ParseInUtils.getSubNodeValue(this.toParseNode, name);
    }

    element.getParsedSubNodeValue=function(name){
		console.log("FIX getParsedSubNodeValue ATTRIBUTE "+name)
        return facilis.parsers.ParseInUtils.getSubNodeValue(this.parsedModel, name);
    }

    element.callParseFunctions=function() {
        for (var i = 0; i < this.parseFunctions.length;i++ ) {
            this.parseFunctions[i].apply(this);
            //(this.parseFunctions[i])();
        }
    }

    element.startParse=function() { 
        this.callParseFunctions();
        return this.parsedModel;
    }

    element.getParsedNode=function(xmlStr) {
        return facilis.parsers.ParseInUtils.getParsedNode(xmlStr);
    }

    element.getData=function(node){
        return facilis.parsers.ParseInUtils.getSubNode(node, "data");
    }

    element.getDocumentation=function() {
        var ObjectTag;
        for (var i = 0; i < this.toParseNode.children.length; i++ ) {				
            if (this.toParseNode.children[i].localName == "Object") {
                ObjectTag = this.toParseNode.children[i];
            }
        }
        var Documentation;
        if(ObjectTag){
            Documentation = facilis.parsers.ParseInUtils.getSubNode(ObjectTag, "Documentation");
        }
        if (!Documentation) {
            i = 0;
            for (i = 0; i < this.toParseNode.children.length; i++ ) {
                if (this.toParseNode.children[i].localName=="Documentation") {
                    Documentation = this.toParseNode.children[i];
                    break;
                }
            }
        }
        var documentation = null;
        var forms = null;
        var events = null;
        var title = null;
        
        if (Documentation) {
            if (this.parsedModel.forms!=null || this.parsedModel.events!=null || this.parsedModel.title!=null) {
                this.parseAdvancedDocumentation(Documentation);
            }else {
                this.parseDocumentationNode(Documentation);
            }
        }
    }

    element.parseDocumentationNode=function(Documentation) {
        if (this.parsedModel.documentation!=null && Documentation && Documentation.firstChild) {
            var first = Documentation.firstChild.textContent;
            if ( (first.indexOf("&lt;forms") >= 0 || first.indexOf("&lt;events") >= 0 || first.indexOf("&lt;documentation") >= 0 || first.indexOf("&lt;title") >= 0) ||
                (first.indexOf("<forms") >= 0 || first.indexOf("<events") >= 0 || first.indexOf("<documentation") >= 0 || first.indexOf("<title") >= 0)
               ) {
                var parsedXML = "<aux>" + first + "</aux>";
                var auxNode = facilis.parsers.ParseInUtils.getParsedNode(parsedXML);
                for (var x = 0; x < auxNode.children.length; x++ ) {
                    var cloned = auxNode.children[x].cloneNode(true);
                    if (cloned.nodeName == "documentation") {
                        this.parsedModel.documentation=cloned.textContent;
                        break;
                    }
                }
            }else if(Documentation.firstChild && Documentation.textContent){
                var description= Documentation.firstChild.textContent;
                //description = description.split("\n").join("");
                if (description) {
					this.parsedModel.documentation=description;
                }
            }
        }
    }

    element.parseAdvancedDocumentation=function(Documentation) {
		console.log("ARREGLAR LOS FORMS EVENTS ETC")
        if (!Documentation.firstChild) {
            return;
        }

        var first = (Documentation.firstChild.wholeText ||  Documentation.firstChild.textContent);
        var doc;
        var forms;
        var events;
        var title; 
		var quote_unescaped = false;
        if (first.indexOf("&amp;lt;")>=0) {
            first = first.split("&amp;lt;").join("&lt;");
            first = first.split("&amp;gt;").join("&gt;");
            first = first.split("&amp;quot;").join("&quot;");
			first = first.split("&amp;amp;").join("&amp;");
            first = first.split(" = ").join("=");
            //Documentation.firstElementChild.removeNode();
            Documentation.firstChild.nodeValue = first;
			quote_unescaped = true;
        }

        if (first.indexOf("&lt;forms")>=0 || first.indexOf("&lt;events")>=0 || first.indexOf("&lt;documentation")>=0 || first.indexOf("&lt;title")>=0) {
            //var parsedXML = "<aux>" + Documentation.firstElementChild.outerHTML + "</aux>";

            /*first = first.split("&lt;").join("<");
            first = first.split("&gt;").join(">");
            first = first.split("&quot;").join("\"");*/

            first = first.split("&lt;events&gt;").join("<events>");
            first = first.split("&lt;forms&gt;").join("<forms>");
            first = first.split("&lt;documentation&gt;").join("<documentation>");
            first = first.split("&lt;title&gt;").join("<title>");

            //Elementos de forms y events
            first = first.split("&lt;event").join("<event");
            first = first.split("&lt;form").join("<form");

            //Atributos de forms
            first = first.split("&lt;attribute").join("<attribute");
			
			if (first.indexOf("<documentation>") >= 0) {
					
				var documentation_split = first.split("<documentation>");
				var documentation_split2;

				var first_aux;
				if (documentation_split.length > 1) {
					//habia algo adelante, lo escapeo
					documentation_split[0] = documentation_split[0].split("&quot;").join("\"");
					documentation_split[0] = documentation_split[0].split("&amp;").join("&");

					documentation_split2 = documentation_split[1].split("</documentation>");
					first_aux = documentation_split[0];
				} else {
					documentation_split2 = documentation_split[0].split("</documentation>");
				}

				if (!quote_unescaped)
					first_aux += "<documentation>" + documentation_split2[0].split("&amp;quot;").join("&quot;").split("&amp;gt;").join("&gt;");
				else 
					first_aux += "<documentation>" + documentation_split2[0];

				first_aux += "</documentation>";

				if (documentation_split2.length > 1) {
					//habia algo despues, lo escapeo
					documentation_split2[1] = documentation_split2[1].split("&quot;").join("\"");
					documentation_split2[1] = documentation_split2[1].split("&amp;").join("&");

					first_aux += documentation_split2[1];
				}

				first = first_aux;

			} else {
				first = first.split("&quot;").join("\"");
				first = first.split("&amp;").join("&");
			}
			

            first = first.split("&lt;/events&gt;").join("</events>");
            first = first.split("&lt;/forms&gt;").join("</forms>");
            first = first.split("&lt;/documentation&gt;").join("</documentation>");
            first = first.split("&lt;/title&gt;").join("</title>");

            //Elements de forms y events
            first = first.split("&lt;/event").join("</event");
            first = first.split("&lt;/form").join("</form");

            //Atributos de forms
            first = first.split("&lt;/attribute").join("</attribute");

            first = first.split("&gt;").join(">");

            first = first.split("&quot;").join("\"");

        }
        
        var parsedXMLStr = "<aux>" + first + "</aux>";

        var auxNode = facilis.parsers.ParseInUtils.getParsedNode(parsedXMLStr);
        for (var x = 0; x < auxNode.children.length; x++ ) {
            var cloned = auxNode.children[x].cloneNode(true);
            if (cloned.nodeName == "documentation") {
                doc = cloned;
            }
            if (cloned.nodeName == "forms") {
                forms = cloned;
            }
            if (cloned.nodeName == "events") {
                events = cloned;
            }
            if (cloned.nodeName == "title") {
                title = cloned;
            }
        }

        var values;
        var value;
        var i = 0;
        var docStr;

        if (doc && doc.firstChild && doc.firstChild.textContent) {
            docStr = doc.firstChild.textContent;
            //docStr = docStr.split("\n").join("");
        }else if (!doc) {
            if(Documentation.firstElementChild && Documentation.firstElementChild.nodeName!="forms" && Documentation.firstElementChild.nodeName!="events" && Documentation.firstElementChild.nodeName!="title"){
                //this.parsedModel.documentation = doc.outerHTML;
				console.log("CHEQUEAR DOCUMENTACION");
				docStr =  doc.outerHTML;
                //docStr = description.split("\n").join("");
            }
        }

        if (docStr && this.parsedModel.documentation!=null) {
            this.parsedModel.documentation =docStr;
        }

        if (forms && this.parsedModel.forms!=null) {

            values = this.getFormValues(forms);
            if (this.parsedModel instanceof facilis.model.Back) {
                for (var f = 0; f < values.length; f++ ) {
                    var id = parseInt(values[f].formId);
                    facilis.controller.FormResources.getInstance().addResource(values[f], id);
                }
            }else{
                this.parsedModel.forms=values;
            }
        }
		this.parsedModel.events=[];
        if (events) {
            this.parsedModel.events=this.parseEventElements(events);
        }
        if (title) {
			this.parsedModel.title=title.getAttribute("value");
        }
    }

    element.getFormValues=function(forms) {
        //var fDoc= facilis.parsers.ParseInUtils.getSubNode(formsData, "doc");
        //var stepData= facilis.parsers.ParseInUtils.getSubNode(fDoc, "data");
		
		console.log("VER EL PARSER DE STEPS");
        //if (!this.parsedModel.step) {
		if (facilis.getClassName(this.parsedModel).toLowerCase()=="back") {
            return this.getProcessForms(forms);
        }

        var stepValues = [];

        var stepsObj = {};
        var step = {order:0,pforms:new Array(),eforms:[]};
        stepsObj["1"] = step;
        var i;

        if (forms.firstElementChild && !forms.firstElementChild.nodeName) {
            forms = facilis.parsers.ParseInUtils.getParsedNode("<forms>"+forms.firstElementChild.outerHTML+"</forms>");
        }

        for (i = 0; i < forms.children.length; i++ ) {
            var form = forms.children[i];
            if (!form.nodeName) {
                form=facilis.parsers.ParseInUtils.getParsedNode(form);
            }
            if (form.frmStepId) {
                if (stepsObj[formfrmStepId]) {
                    step = stepsObj[form.frmStepId];
                }else {
                    step = { order:parseInt(form.frmStepId),pforms:[],eforms:[] };
                    stepsObj[form.frmStepId]=step;
                }
            }
            var frmOrder = i;
            if (form.frmOrder) {
                frmOrder = parseInt(form.frmOrder);
            }
            var frmType = form.frmType;
            if(frmType=="P"){
                step.pforms.push( { order:frmOrder, form:form } );
            }else {
                step.eforms.push( { order:frmOrder, form:form } );
            }
        }

        var stepArray = [];
        for (var stepNum in stepsObj) {
            stepArray.push(stepsObj[stepNum]);
        }

        stepArray.sort(function(a, b) {
                    if (parseInt(a.order) == parseInt(b.order)) {
                        return parseInt(a.frmOrder)-parseInt(b.frmOrder);
                    }
                    return (parseInt(a.order) - parseInt(b.order));
                } );
        
        i = 0;

        for (i = 0; i < stepArray.length; i++ ) {
            var stepEFormsValues = [];
            var stepPFormsValues = [];

			
			
			var formsArr = stepArray[i].eforms;
            formsArr.sort(function(a, b) {
                    if (parseInt(a.order) == parseInt(b.order)) {
                        return parseInt(a.frmOrder)-parseInt(b.frmOrder);
                    }
                    return (parseInt(a.order) - parseInt(b.order));
                } );
            var f = 0;
            var frmValue;
            for (f = 0; f < formsArr.length; f++ ) {
                frmValue = this.getFormValue(formsArr[f].form);
                if (frmValue) {
                    stepEFormsValues.push(frmValue);
                }
            }
            formsArr = stepArray[i].pforms;
            formsArr.sort(function(a, b) {
                    if (parseInt(a.order) == parseInt(b.order)) {
                        return parseInt(a.frmOrder)-parseInt(b.frmOrder);
                    }
                    return (parseInt(a.order) - parseInt(b.order));
                } );
            f = 0;
            for (f = 0; f < formsArr.length; f++ ) {
                frmValue = this.getFormValue(formsArr[f].form);
                if (frmValue) {
                    stepPFormsValues.push(frmValue);
                }
            }
			
			console.log("FIX STEP FORMS PARSER GET STEP REQUIRED");
			var stepValue={};
			
			//if (stepValue.stepformse!=null){
				stepValue.stepformse=stepEFormsValues;
				console.log("stepformse en ElementParser.as");
			/*} 
			if(stepValue.entityforms!=null) {*/
				stepValue.entityforms=stepEFormsValues;
				console.log("entityforms en ElementParser.as");
			/*} 
			if (stepValue.stepformsp!=null){
				stepValue.stepformsp=stepPFormsValues;*/
				console.log("stepformsp en ElementParser.as");
			/*} 
			if(stepValue.stepformsp!=null) {*/
				stepValue.stepformsp=stepPFormsValues;
				console.log("stepformsp en ElementParser.as");
			//}
			stepValues.push(stepValue);
        }
        return stepValues;
    }

    element.getProcessForms=function(forms, formsData) {

        var values = [];
        for (var i = 0; i < forms.children.length; i++ ) {
            values.push(this.getFormValue(forms.children[i]));
        }
        return values;
    }

    element.getFormValue=function(form,addNoExist) {
        if(!(form.getAttribute("name")=="undefined" && form.getAttribute("description")=="undefined") /*|| forms.children.length!=3*/){
            var formEl = new facilis.model.Form();
            formEl.formId = (((form.getAttribute("frmId") + "") != "undefined")?form.getAttribute("frmId"):"");
            formEl.formName = (((form.getAttribute("frmName") + "") != "undefined")?form.getAttribute("frmName"):"");
            formEl.formDesc = (((form.getAttribute("frmTitle") + "") != "undefined")?form.getAttribute("frmTitle"):"");
            if (formEl.formName=="" && form.getAttribute("name")) {
                formEl.formName = (((form.getAttribute("name") + "") != "undefined")?form.getAttribute("name"):"");
            }
            if (formEl.formDesc=="" && form.attributes.description) {
                formEl.formDesc = (((form.attributes.description + "") != "undefined")?form.attributes.description:"");
            }
            
			var evts=facilis.parsers.ParseInUtils.getSubNode(form, "events");
			if(formEl.frmEvents!=null){
				formEl.frmEvents=[];
            	if (evts) {
                    frmEvents=this.parseEventElements(evts);
                }
            }
            
            if(formEl.doc!=null){
                formEl.doc=[];
				for (var d = 0; d < form.children.length; d++ ) {
                    if(form.children[d].nodeName=="attribute" || form.children[d].nodeName=="documentation"){
						var dValue={};

						if (!form.children[d].getAttribute("attName") && form.children[d].getAttribute("name")) {
							form.children[d].setAttribute("attName", form.children[d].getAttribute("name"));
						}
						if (!form.children[d].getAttribute("attLabel") && form.children[d].getAttribute("description")) {
							form.children[d].setAttribute("attLabel", form.children[d].getAttribute("description"));
						}
						if (!form.children[d].getAttribute("regExp") && form.children[d].getAttribute("rules")) {
							form.children[d].setAttribute("regExp", form.children[d].getAttribute("rules"));
						}

						dValue.fname=form.children[d].getAttribute("attName");
						dValue.description=form.children[d].getAttribute("attLabel");
						dValue.tooltip=form.children[d].getAttribute("attTooltip");
						dValue.datatype=form.children[d].getAttribute("datatype");
						dValue.fieldtype=this.getFieldType(form.children[d].getAttribute("fieldtype"));
						dValue.rules=form.children[d].getAttribute("regExp");
						dValue.grid=form.children[d].getAttribute("grid");
						formEl.doc.push(dValue);
                    }
                }
            }
            if(formEl.formId=="" && addNoExist){
                var frmAdded = this.addFormResource(form);
                formEl.formId=frmAdded.resourceId;
            }
            return formEl;
        }
        return null;
    }

    element.addFormResource=function(form){
        var mainXML = facilis.View.getInstance().getMainProcessData();
        mainXML.forms;
        var parsedForm = form;
        if (parsedForm.formName) {
            if (!facilis.controller.FormResources.getInstance().checkExists(parsedForm.formName)) {
                parsedForm = facilis.controller.FormResources.getInstance().addResource(form);					
            } else {
                parsedForm.resourceId= facilis.controller.FormResources.getInstance().getExistingId(parsedForm.formName);
            }
        } else {				
            parsedForm = facilis.controller.FormResources.getInstance().addResource(parsedForm);
        }
        return parsedForm;
    }

    element.getFieldType=function(type) {
        var t = "";
        switch (type){
            case "Radio":
            t = "Radio Button";
            break;
            case "TextArea":
            t = "Text Area";
            break;
            case "FileInput":
            t = "File Input";
            break;
            case "Listbox":
            t = "ListBox";
            break;
            case "Checkbox":
            t = "CheckBox";
            break;
            case "Combobox":
            t = "ComboBox";
            break;
            default:
            t = type;
            break;
        }
        if (t == "Input" || t == "ComboBox" || t == "ListBox" || t == "CheckBox" || t == "Radio Button" || t == "Text Area" || t == "File Input" || t == "Editor" || t == "Password") {
            //return t;
        }else{
            t="Input";
        }
        return t;
    }

    element.parseEventElements=function(events) {
        var parsedEvents=[];
        
		if (events.firstElementChild && !events.firstElementChild.nodeName) {
            events = facilis.parsers.ParseInUtils.getParsedNode("<events>"+events.firstElementChild.outerHTML+"</events>");
        }
        for (var i=0; i < events.children.length; i++ ) {
            var event = events.children[i];
            if(!(event.getAttribute("name")=="undefined" && event.getAttribute("description")=="undefined")){
                var value = new facilis.model.Event();
                if (!event.getAttribute("busClaName") && event.getAttribute("action")) {
                    event.setAttribute("busClaName", event.getAttribute("action"));
                }
                if (!event.getAttribute("evtName") && event.getAttribute("name")) {
                    event.setAttribute("evtName", event.getAttribute("name"));
                }
                value.evtName=((event.getAttribute("evtName")!="undefined")?event.getAttribute("evtName"):"");
                value.clsName= ((event.getAttribute("busClaName")!= "undefined")?event.getAttribute("busClaName"):"");
                value.clsDesc=((event.getAttribute("busClaDesc")!= "undefined")?event.getAttribute("busClaDesc"):"");
                parsedEvents.push(value);
            }
        }
		return parsedEvents;
    }

    element.parseCategories=function() {
		var ObjectTag = this.getToParseSubNode("Object");
		var Categories = facilis.parsers.ParseInUtils.getSubNode(ObjectTag, "Categories");
		if(Categories && this.parsedModel.categories){
			this.parsedModel.categories=this.parseCategoriesNode(Categories);
		}
    }

    element.parseCategoriesNode=function(Categories) {
        this.parseSubCategories(Categories, values);
    }

    element.parseSubCategories=function(Categories) {
		var ret=[];
        for (var i = 0; i < Categories.children.length;i++ ) {
            var category = this.getCategoryNode(Categories.children[i]);
            if (category) {
                ret.push(category);
            }
        }
		return ret;
    }

    element.getCategoryNode=function(Category) {
        var level = {};
        level.id=Category.getAttribute("CategoryId");
        level.value=Category.getAttribute("Name");
        level.type="label";
        if(Category.children.length>0){
            level.subCategories=this.parseSubCategories(Category);
        }
        return level;
    }

    element.parseProperties=function() {
        var Properties = this.getToParseSubNode("Properties");
        if(this.parsedModel.properties!=null)
			this.parsedModel.properties=this.parsePropertiesNode(Properties);
    }

    element.parsePropertiesNode=function(Properties) {
        var properties=[];
		if (Properties) {
            for (var i = 0; i < Properties.children.length; i++ ) {
                var Property = Properties.children[i];
                var value= {};
				value.name=Property.getAttribute("Name");
				value.id=Property.getAttribute("PropertyId");
				value.propertytype= Property.getAttribute("PropertyType");
				value.value=Property.getAttribute("Type");
				value.type=Property.getAttribute("Value");
				value.correlation=Property.getAttribute("Correlation");
				value.uk=Property.getAttribute("UK");
				value.multivalued=Property.getAttribute("Multivalued");
				value.index=Property.getAttribute("Index");
                properties.push(value);
            }
        }
		return properties;
    }


    element.parseDataFields=function() {
        var DataFields= this.getToParseSubNode("DataFields");
        if(this.parsedModel.properties!=null)
        	this.parsedModel.properties=this.parseDataFieldsNode(DataFields);
    }

    element.parseDataFieldsNode=function(DataFields) {
		
		var properties=[];
		if (DataFields) {
            for (var i = 0; i < DataFields.children.length; i++ ) {
                var Property = DataFields.children[i];
                var value= {};
				value.name=Property.getAttribute("Name");
				value.value=Property.getAttribute("Type");
				value.type=Property.getAttribute("Value");
				value.correlation=Property.getAttribute("Correlation");
				value.uk=Property.getAttribute("UK");
				value.multivalued=Property.getAttribute("Multivalued");
				value.index=Property.getAttribute("Index");
                properties.push(value);
            }
        }
		return properties;
    }

    element.parseUserAttributes=function() {
        var ExtendedAttributes= this.getToParseSubNode("ExtendedAttributes");
        if(ExtendedAttributes){
            if (this.parsedModel.userproperties!=null) {
				for (var i = 0; i < ExtendedAttributes.children.length;i++ ) {
					var value= {};
					value.name= ExtendedAttributes.children[i].getAttribute("Name");
					value.value= ExtendedAttributes.children[i].getAttribute("Value");
					value.type= ExtendedAttributes.children[i].getAttribute("Type");
					parsedModel.userproperties.push(value);
				}
            }
        }
    }

    element.getSubElements=function() {
		console.log("called element.getSubElements");
        return this.parsedModel.subElements;
    }

    


    facilis.parsers.input.ElementParser = facilis.promote(ElementParser, "Object");
    
}());
