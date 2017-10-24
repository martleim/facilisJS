(function() {

    function Event() {
        this.Activity_constructor();
        this.parseFunctions.push(this.getAttached);
        this.parseFunctions.push(this.getEvent);
        this.parseFunctions.push(this.getTrigger);
        this.parseFunctions.push(this.getTriggerElement);
    }
    
    var element = facilis.extend(Event, facilis.parsers.input.Activity);
    
    
    element.getEvent=function() {
        var name = this.toParseNode.getAttribute("name");
        var Event = (this.getToParseSubNode("BPMNEvent"))?this.getToParseSubNode("BPMNEvent"):this.getToParseSubNode("Event");
        var val= Event.firstElementChild.localName;
        var evtType = ((val=="StartEvent")?"startevent": (val=="IntermediateEvent")? "middleevent" : "endevent"  );
        this.parsedModel.eventType= evtType;
    }

    element.getTrigger=function() {
        var event = (this.getToParseSubNode("BPMNEvent"))?this.getToParseSubNode("BPMNEvent"):this.getToParseSubNode("Event");
        var eventType = (event.firstElementChild.getAttribute("Trigger"))?event.firstElementChild.getAttribute("Trigger"):"";
        if (event.firstElementChild.getAttribute("Result")) {
            eventType = event.firstElementChild.getAttribute("Result");
        }
		if(this.parsedModel.eventdetailtype!=null)
        	this.parsedModel.eventdetailtype = eventType;
    }

    element.getTriggerElement=function() {
        var TriggerMultiple = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "TriggerMultiple");
        var TriggerResultMessage = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "TriggerResultMessage");
        var TriggerTimer = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "TriggerTimer");
        var TriggerConditional = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "TriggerConditional");
        var TriggerResultSignal = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "TriggerResultSignal");
        var ResultError = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "ResultError");
        var TriggerResultCompensation = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "TriggerResultCompensation");
        if (TriggerMultiple) {
            this.parseMultipleTrigger(TriggerMultiple, facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "multiple"));
        }else if(TriggerResultMessage){
            this.parseMessageTrigger(TriggerResultMessage, facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "message"));
        }else if(TriggerTimer){
            this.parseTimerTrigger(TriggerTimer, facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "timer"));
        }else if(TriggerConditional){
            this.parseConditionalTrigger(TriggerConditional, facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "conditional"));
        }else if(TriggerResultSignal){
            this.parseConditionalTrigger(TriggerResultSignal, facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "signal"));
        }else if(ResultError){
            this.parseErrorTrigger(ResultError, facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "error"));
        }else if(TriggerResultCompensation){
            this.parseCompensationTrigger(TriggerResultCompensation, facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "compensation"));
        }
    }

    element.getAttached=function() {
        var IntermediateEvent = this.getToParseSubNode("IntermediateEvent");
        if (IntermediateEvent && (IntermediateEvent.getAttribute("IsAttached") == "true" || IntermediateEvent.getAttribute("Target"))) {
            this.parsedModel.target=IntermediateEvent.getAttribute("Target");
            this.parsedModel.isattached=true;
        }else if (IntermediateEvent) {
            this.parsedModel.isattached=false;
        }
    }



    element.parseMessageTrigger=function(TriggerResultMessage, trigger) {
        var WebServiceThrow;
        var WebServiceMapping;
        if (TriggerResultMessage) {
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "name", TriggerResultMessage.getAttribute("Name"));
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "implementation", this.toParseNode.getAttribute("Implementation"));
            if (trigger && this.parsedModel.getAttribute("name") == "middleevent" ) {
                trigger.setAttribute("disabled", "false");
                //WebServiceThrow = facilis.parsers.ParseInUtils.getSubNode(TriggerResultMessage, "WebServiceThrow");
                var messagethrow = facilis.parsers.ParseInUtils.getSubNode(trigger, "outmessageref");
                var messagecatch = facilis.parsers.ParseInUtils.getSubNode(trigger, "inmessageref");
                WebServiceMapping = facilis.parsers.ParseInUtils.getSubNode(TriggerResultMessage, "WebServiceMapping");
                if (WebServiceMapping) {
                    if(messagethrow){
                        messagethrow.setAttribute("disabled", "true");
                    }
                    parseWebServiceCatchNode(WebServiceMapping, messagecatch);
                    facilis.parsers.ParseInUtils.setSubNodeValue(trigger,"catchthrow", "CATCH");
                }else {
                    if(messagecatch){
                        messagecatch.setAttribute("disabled", "true");
                    }
                    facilis.parsers.ParseInUtils.setSubNodeValue(trigger,"catchthrow", "THROW");
                    parseWebServiceThrowNode(null, messagethrow);
                }
                if (TriggerResultMessage.getAttribute("CatchThrow")) {
                    facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "catchthrow", (TriggerResultMessage.getAttribute("CatchThrow")+"").toUpperCase());
                }
            }else if (!trigger && this.parsedModel.getAttribute("name") == "middleevent" ) {
                facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "catchthrow", (TriggerResultMessage.getAttribute("CatchThrow")+"").toUpperCase());
            }else if (this.parsedModel.getAttribute("name") == "endevent") {
                WebServiceThrow = facilis.parsers.ParseInUtils.getSubNode(TriggerResultMessage, "WebServiceThrow");
                parseWebServiceThrowNode(null, trigger);
            }else {
                WebServiceMapping = facilis.parsers.ParseInUtils.getSubNode(TriggerResultMessage, "WebServiceMapping");
                //var msgcatch = facilis.parsers.ParseInUtils.getSubNode(trigger, "message");
                if (WebServiceMapping) {
                    parseWebServiceCatchNode(WebServiceMapping, trigger);
                }
            }

        }
    }

    element.parseTimerTrigger=function(TriggerTimer, trigger) {
        if (TriggerTimer) {
            var timeDate = TriggerTimer.getAttribute("TimeDate");
            var endDate = TriggerTimer.getAttribute("EndDate");
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "initdate", timeDate);
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "enddate", endDate);

            var timerattribute = facilis.parsers.ParseInUtils.getSubNode(trigger, "timerattribute");
            if (timerattribute && timerattribute.firstElementChild && timerattribute.firstElementChild.firstElementChild) {
                timerattribute.firstElementChild.firstElementChild.setAttribute("value", TriggerTimer.getAttribute("TimerAttName"));
                facilis.parsers.ParseInUtils.setSubNodeValue(timerattribute, "name", TriggerTimer.getAttribute("TimerAttName"));
                facilis.parsers.ParseInUtils.setSubNodeValue(timerattribute, "id", TriggerTimer.getAttribute("TimerAttId"));
                timerattribute.setAttribute("value", TriggerTimer.getAttribute("TimerAttName"));
                facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "timerattributetype", TriggerTimer.getAttribute("TimerAttType"));
            }
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "value", TriggerTimer.getAttribute("TimeCycle"));
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "unit", TriggerTimer.getAttribute("TimeUnit"));
        }
    }

    element.parseConditionalTrigger=function(TriggerConditional, trigger) {
        if (TriggerConditional) {
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "name", TriggerConditional.getAttribute("Name"));
            var Expression = facilis.parsers.ParseInUtils.getSubNode(TriggerConditional, "Expression");
            if (Expression) {
                facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "expressionbody", Expression.firstElementChild.nodeValue);
            }
        }
    }

    element.parseSignalTrigger=function(TriggerResultSignal, trigger) {
        if (TriggerResultSignal) {
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "name", TriggerResultSignal.getAttribute("Name"));
        }
    }

    element.parseMultipleTrigger=function(TriggerMultiple, trigger) {
        
        var message = facilis.parsers.ParseInUtils.getSubNode(trigger, "multimessage");
        var timer = facilis.parsers.ParseInUtils.getSubNode(trigger, "multitimer");
        var values;
        if (TriggerMultiple) {
            for (var i = 0; i < TriggerMultiple.children.length; i++ ) {
                if (TriggerMultiple.children[i].nodeName == "TriggerResultMessage") {
                    parseMessageTrigger(TriggerMultiple.children[i], message);
                }else if (TriggerMultiple.children[i].nodeName == "TriggerTimer") {
                    parseTimerTrigger(TriggerMultiple.children[i], timer);
                }
            }
        }
    }

    element.parseErrorTrigger=function(ResultError, trigger) {
        if (ResultError) {
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "errorcode", ResultError.getAttribute("ErrorCode"));
        }
    }

    element.parseCompensationTrigger=function(TriggerResultCompensation, trigger) {
        if (TriggerResultCompensation) {
            var activitytype = TriggerResultCompensation.getAttribute("ActivityType");
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "activitytype", activitytype);
            if(activitytype=="Task"){
                facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "activityreftask", TriggerResultCompensation.getAttribute("ActivityId"));
            }else {
                facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "activityrefsubproc", TriggerResultCompensation.getAttribute("ActivityId"));
            }
        }
    }

    element.parseMultiCompensationTrigger=function(TriggerResultCompensation, trigger) {
        if (TriggerResultCompensation) {
            trigger = facilis.parsers.ParseInUtils.getSubNode(trigger, "activityref");
            var values = this.parsedModel.ownerDocument.createElement( "values");
            var valueStr = "<value value=\"" + TriggerResultCompensation.getAttribute("ActivityId") + "\"><level name=\"name\" value=\"" + TriggerResultCompensation.getAttribute("ActivityId") + "\" /><level name=\"type\" value=\"" + TriggerResultCompensation.getAttribute("ActivityType") + "\" /></value>"
            trigger.setAttribute("value", TriggerResultCompensation.getAttribute("ActivityId"));
            var value = facilis.parsers.ParseInUtils.getParsedNode(valueStr);
            values.appendChild(value);
            trigger.appendChild(values);
        }
    }
    

    facilis.parsers.input.Event = facilis.promote(Event, "Activity");
    
}());