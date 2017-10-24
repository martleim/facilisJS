/*TODO sin terminar*/
(function() {

    function Activity() {
        this.ElementParser_constructor();
        this.parseFunctions.push(this.getElementType);
        this.parseFunctions.push(this.parseAssignments);
        this.parseFunctions.push(this.parsePerformers);
        this.parseFunctions.push(this.parseProEleId);
        
    }
    
    var element = facilis.extend(Activity, facilis.parsers.input.ElementParser);

    element.startParse=function() {
        this.callParseFunctions();
        return this.parsedModel;
    }

    element.getElementType=function() {
        var type = this.toParseNode.getAttribute("name");
        if (type=="gateway") {
            this.parsedModel.ElementType="G";
        }else if (type=="task") {
            this.parsedModel.ElementType="T";
        }else if (type=="csubflow" || type=="esubflow") {
            this.parsedModel.ElementType="S";
        }else if (type=="startevent" || type=="middleevent" || type == "endevent") {
            this.parsedModel.ElementType="E";
        }
    }


    element.parseAssignments=function() {
        var Assignments = this.getToParseSubNode("Assignments");
        if(this.parsedModel.assignments!=null)
        	this.parsedModel.assignments=this.parseAssignmentsNode(Assignments);
    }

    element.parseAssignmentsNode=function(Assignments) {
		var ret=[];
        if(Assignments){
            for (var i = 0; i < Assignments.children.length; i++ ) {
                ret.push(this.getAssignment(Assignments.children[i]));
            }
        }
		return ret;
    }

    element.getAssignment=function(Assignment ) {
		console.log("FIX element.getAssignment");
		var assignment={};
        var from = facilis.parsers.ParseInUtils.getSubNode(assignment, "from");
        var to = facilis.parsers.ParseInUtils.getSubNode(assignment, "to");

        var Expression = facilis.parsers.ParseInUtils.getSubNode(Assignment, "Expression");
        var Target = facilis.parsers.ParseInUtils.getSubNode(Assignment, "Target");

        var value = to.values;
		value.name= Target.getAttribute("Name");
		value.type= Target.getAttribute("Type");
		value.value= Target.getAttribute("Value");
		value.correlation= Target.getAttribute("Correlation");
		value.targettype= Target.getAttribute("TargetType");
		value.index= Target.getAttribute("Index");

        if(Expression.firstElementChild){
            facilis.parsers.ParseInUtils.setSubNodeValue(from, "expressionbody", Expression.firstElementChild.nodeValue);
        }

        facilis.parsers.ParseInUtils.setSubNodeValue(assignment, "assigntime", Assignment.getAttribute("AssignTime"));
		return assignment;
    }

    element.parsePerformers=function() {
        var Performers = this.getToParseSubNode("Performers");
        if (!Performers) {
            var Performer = this.getToParseSubNode("Performer");
            if (Performer) {
                Performers = this.parsedModel.ownerDocument.createElement( "Performers");
                Performers.appendChild(Performer);
            }
        }
		if(this.parsedModel.performers!=null)
        	this.parsedModel.performers=this.parsePerformersNode(Performers);

    }

    element.parsePerformersNode=function(Performers, performers) {
        if (this.parsedModel.performers && !(this.parsedModel.performers instanceof Array) ){
            if(Performers && Performers.firstElementChild && Performers.firstElementChild.firstElementChild) {
               return Performers.firstElementChild.firstElementChild.nodeValue;
            }
        }else if (Performers) {
			var performers=[];
            for (var i = 0; i < Performers.children.length; i++ ) {
                var Performer = Performers.children[i];
                var perfName = Performer.getAttribute("PerfName");
                var perfId = Performer.getAttribute("PerfId");

                if (!perfId && Performer.firstChild) {
                    perfId = Performer.firstChild.nodeValue;
                    var participant = facilis.parsers.ParserIn.getParticipantByIdOrName(perfId);
                    if (participant) {
                        perfId = participant.id;
                    }
                }
                if (!perfName) {
                    var p=facilis.parsers.ParserIn.getParticipantById(perfId);
                    if (p) {
                        perfName = p.name;
                    }
                }
				
				var parsedPerformer=new facilis.model.Performer();
                parsedPerformer.id= perfId;
                parsedPerformer.name=perfName;
				var Documentation = facilis.parsers.ParseInUtils.getSubNode(Performer,"Documentation");
                
				if (Documentation && parsedPerformer.documentation) {
                    parsedPerformer.documentation=this.parseDocumentationNode(Documentation);
                }
				
				if (parsedPerformer.condition && Performer.getAttribute("ProElePerfEvalCond")) {
                    parsedPerformer.condition=Performer.getAttribute("ProElePerfEvalCond");
                }
                if (parsedPerformer.conditionDoc && Performer.getAttribute("ConditionDoc")) {
                    parsedPerformer.conditionDoc = Performer.getAttribute("ConditionDoc");
                }
                if (perfName!="busClass") {
                    performers.push(parsedPerformer);
                }
            }
            return performers;
        }
    }

    element.parseWebServiceCatchNode=function(WebServiceCatchNode,messagecatch) {
        this.parseCatchWs(WebServiceCatchNode,messagecatch);
    }

    element.parseCatchWs=function(WebServiceMapping, messagecatch) {
        if(WebServiceMapping.firstElementChild){
            this.parseWs(WebServiceMapping.firstElementChild, messagecatch);
        }
    }

    element.parseWs=function(webservice, messagecatch) {
        //var value = data.cloneNode(true);
        var value = messagecatch.firstElementChild;
        var wsName = value.children[0];
        wsName.value=webservice.getAttribute("ws_method_name");
        var pAtts = value.children[1];
        var pValues = this.parsedModel.ownerDocument.createElement( "values");
        pAtts.appendChild(pValues);
        var eAtts = value.children[2];
        var eValues = this.parsedModel.ownerDocument.createElement( "values");
        eAtts.appendChild(eValues);
        for (var i = 0; i < webservice.children.length; i++ ) {
            var fValue;
            if (webservice.children[i].getAttribute("attribute_type") == "E") {
                fValue = this.getData(eAtts).cloneNode(true);
                eValues.appendChild(fValue);
            }else {
                fValue = this.getData(pAtts).cloneNode(true);
                pValues.appendChild(fValue);
            }
            fValue.nodeName = "value";
            facilis.parsers.ParseInUtils.setSubNodeValue(fValue, "id", webservice.children[i].getAttribute("attribute_id"));
            facilis.parsers.ParseInUtils.setSubNodeValue(fValue, "name", webservice.children[i].getAttribute("name"));
            facilis.parsers.ParseInUtils.setSubNodeValue(fValue, "uk", (webservice.children[i].getAttribute("attribute_uk")=="T").toString());
            facilis.parsers.ParseInUtils.setSubNodeValue(fValue, "multivalued", (webservice.children[i].getAttribute("multivalued")=="T").toString());

        }
    }

    element.parseEvents=function(Events) {
		var bussinesClasses=[];
		if (Events) {
			for (var i = 0; i < Events.children.length; i++ ) {
				if(!Events.children[i].getAttribute("WS") || (Events.children[i].getAttribute("WS")=="false")){
					var event = this.parseEventClass(Events.children[i]);
					if(event){
						bussinesClasses.push(event);
					}
				}
			}
		}
		return bussinesClasses;
    }

    element.parseEventClass=function(event) {
        if (event.getAttribute("BusClaName") == "BPMNAutoComplete") {
            return null;
        }
		var value={};
        value.evtid=event.getAttribute("EvtId");
        value.clsid=event.getAttribute("BusClaId");
        value.evtname=event.getAttribute("EvtName");
        value.clsname=event.getAttribute("BusClaName");
        this.setSkipCondition(value,event.getAttribute("SkipCond"));

        value.binding=this.parseBindings(facilis.parsers.ParseInUtils.getSubNode(event, "BusClaParBindings"));

        return value;
    }

    element.setSkipCondition=function(value, condition) {
		value.skipcondition=condition;
    }

    element.parseBindings=function(BusClaParBindings) {
        var values = [];
        if (BusClaParBindings) {
            for (var i = 0; i < BusClaParBindings.children.length; i++ ) {
                var value = {};
                value.id= BusClaParBindings.children[i].getAttribute("BusClaParId");
                value.param= BusClaParBindings.children[i].getAttribute("BusClaParName");
                value.type= BusClaParBindings.children[i].getAttribute("BusClaParType");
                value.value= (BusClaParBindings.children[i].getAttribute("BusClaParBndValue")?BusClaParBindings.children[i].getAttribute("BusClaParBndValue"):"");
                value.attribute= (BusClaParBindings.children[i].getAttribute("AttName")?BusClaParBindings.children[i].getAttribute("AttName"):"");
                //FIX  value.attribute").getAttribute("atttype") = ((BusClaParBindings.children[i].getAttribute("BusClaParBndType") + "")  == "P")?"process":"entity";
                value.attributeid= (BusClaParBindings.children[i].getAttribute("AttId")?BusClaParBindings.children[i].getAttribute("AttId"):"");
				value.attributetooltip= (BusClaParBindings.children[i].getAttribute("AttTooltip") ? BusClaParBindings.children[i].getAttribute("AttTooltip") : "");
				values.push(value);
            }
        }
		return values;
    }


    element.parseWebServiceThrowNode=function(WebServiceThrow, messagethrow) {
        this.parseThrowWs(messagethrow);

    }

    element.parseThrowWs=function(messagethrow) {
        var bussinessclasses = [];
        var ApiaTskEvents = this.getToParseSubNode("ApiaEvents");
        if (ApiaTskEvents && (ApiaTskEvents.children.length > 0)) {
            for (var i = 0; i < ApiaTskEvents.children.length; i++ ) {
                var ApiaTskEvent = this.parseWsEventClass(ApiaTskEvents.children[i]);
                if (ApiaTskEvents.children[i].getAttribute("WS") && ApiaTskEvents.children[i].getAttribute("WS") == "true" && ApiaTskEvents.children[i].getAttribute("BusClaId") != "102") {
                    bussinessclasses.push(ApiaTskEvent);
                }
            }
        }
		return bussinessclasses;
    }

    element.parseWsEventClass=function(ApiaTskEvent,value) {
		
		var value={evtname:"",evtid:"",clsname:"",clsid:"",binding:[]};

        value.evtid=ApiaTskEvent.getAttribute("EvtId");
        value.clsid=ApiaTskEvent.getAttribute("BusClaId");
        value.evtname=ApiaTskEvent.getAttribute("EvtName");
        value.clsname= ApiaTskEvent.getAttribute("BusClaName");

        value.binding=this.parseWsBindings(facilis.parsers.ParseInUtils.getSubNode(ApiaTskEvent, "BusClaParBindings"));

        return value;
    }

    element.parseWsBindings=function(BusClaParBindings, node) {
        var values = [];
        if (BusClaParBindings) {
            for (var i = 0; i < BusClaParBindings.children.length; i++ ) {
                var value = {id:"",param:"",type:"",value:"",attribute:"",attributeid:"",inout:"",attributetooltip:""};
                value.id= BusClaParBindings.children[i].getAttribute("BusClaParId");
                value.param= BusClaParBindings.children[i].getAttribute("BusClaParName");
                value.type= BusClaParBindings.children[i].getAttribute("BusClaParType");
                value.value= BusClaParBindings.children[i].getAttribute("BusClaParBndValue");
                value.attribute = ((BusClaParBindings.children[i].getAttribute("AttName"))?BusClaParBindings.children[i].getAttribute("AttName"):"");
                value.attributeid=(BusClaParBindings.children[i].getAttribute("AttId"))?BusClaParBindings.children[i].getAttribute("AttId"):"";
                value.uk=BusClaParBindings.children[i].getAttribute("UK");
                value.multivalued=BusClaParBindings.children[i].getAttribute("Multivalued");
				values.push(value);
            }
        }
		return values;
    }


    element.getWsPublications=function() {
        var WsPublications = this.getToParseSubNode("WsPublications");
        if (WsPublications) {
            var webservices = this.getParsedSubNode("webservices");
            var data = this.getData(webservices);
            var values = this.parsedModel.ownerDocument.createElement( "values");
            if (data) {
                for (var i = 0; i < WsPublications.children.length; i++ ) {
                    var WsPublication = WsPublications.children[i];
                    var value = data.cloneNode(true);
                    value.nodeName = "value";
                    facilis.parsers.ParseInUtils.getSubNode(value, "wsname").value= WsPublication.getAttribute("WsName");
                    var WsPublicationAttributes = facilis.parsers.ParseInUtils.getSubNode(WsPublication, "WsPublicationAttributes");
                    var entAtts = facilis.parsers.ParseInUtils.getSubNode(value, "entityattributes");
                    var pcsAtts = facilis.parsers.ParseInUtils.getSubNode(value, "processattributes");
                    if (WsPublicationAttributes){
                        var entAttsValues = this.parsedModel.ownerDocument.createElement( "values");
                        var pcsAttsValues = this.parsedModel.ownerDocument.createElement( "values");
                        entAtts.appendChild(entAttsValues);
                        pcsAtts.appendChild(pcsAttsValues);
                        var attData = this.getData(entAtts);

                        for (var u = 0; u < WsPublicationAttributes.children.length; u++ ) {
                            var val = parseWSAttribute(attData,WsPublicationAttributes.children[u]);
                        }

                    }
                }
            }
        }
    }

    element.parseWSAttribute=function(dataXML, WsPublicationAttribute) {
        var value = dataXML.cloneNode(true);
        if(WsPublicationAttribute){
            for (var i = 0; i < WsPublicationAttribute.children.length; i++ ) {
                /*var value = values.children[i];
                var WsPublicationAttribute = this.parsedModel.ownerDocument.createElement( "WsPublicationAttribute");
                WsPublicationAttributes.appendChild(WsPublicationAttribute);
                WsPublicationAttribute.WsAttType", type);
                for (var u = 0; u < value.children.length; u++ ) {
                    var name = value.children[u].getAttribute("name");
                    var val = value.children[u].getAttribute("value");
                    if(val){
                        if (name=="id") {
                            WsPublicationAttribute.AttId", val);
                        }else if (name=="name") {
                            WsPublicationAttribute.AttName", val);
                        }else if (name=="unique") {
                            WsPublicationAttribute.WsAttUk", val);
                        }else if (name=="multiple") {
                            WsPublicationAttribute.Multivaluated", val);
                        }
                    }
                }*/
            }
        }
    }

    element.parseProEleId=function() {
        var ProEleId = this.toParseNode.getAttribute("Id");
        /*var ProEleId = this.toParseNode.getAttribute("ProId");
        if (!ProEleId) {
            ProEleId = this.toParseNode.getAttribute("Id");
        }*/
        if (ProEleId) {
            this.parsedModel.proeleid= ProEleId;
        }
    }
    
    
    facilis.parsers.input.Activity = facilis.promote(Activity, "ElementParser");
    
}());
