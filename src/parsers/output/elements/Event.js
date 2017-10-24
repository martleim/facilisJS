/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements {
	import flash.xml.XMLNode;
	import parsers.output.ParseOutUtils;
	import view.View;

	public class Event extends Activity {
		
		var evtNode:XMLNode;
		
		public function Event() {
			addParseFunction(getEvent);
			addParseFunction(getTriggerElement);
			super();
			addParseFunction(getProEleDesignXML);
		}
		
		function getEvent() {
			var name = this.toParseNode.attributes.name;
			var evtType = (name == "startevent")?"StartEvent": ((name == "middleevent")? "IntermediateEvent" : "EndEvent"  );
			var xmlStr = "";
			var xpdlNS = View.getInstance().offline?(" xmlns:xpdl=\"" + ElementParser.XPDL_NAMESPACE) + "\" ":"";
			var eventNode:XMLNode = new XMLNode(1, ElementParser.offline + "Event");
			var EventType:XMLNode = new XMLNode(1, ElementParser.offline + evtType);
			eventNode.appendChild(EventType);
			if (name == "endevent") {
				if(getResult()){
					EventType.attributes.Result = getResult();
				}
				eventNode.appendChild(EventType);
			}else {
				if (evtType == "IntermediateEvent") {
					if (!View.getInstance().offline && toParseNode.attributes.attached && toParseNode.attributes.attached!="") {
						EventType.attributes[ElementParser.apia + "IsAttached"] = "true";
						//EventType.attributes[ElementParser.apia + "Target"] = toParseNode.attributes.attached;
					}
					
				}
				getTrigger()
				EventType.attributes.Trigger = getTrigger();
			}
			evtNode = eventNode.firstChild;
			parsedNode.appendChild(eventNode);
			
			getAttached(eventNode);
			if (name == "middleevent" && toParseNode.attributes.isattached!="true") {
				addBusPool();
			}
		}
		
		function getTrigger() {
			var type = getToParseSubNodeValue("eventdetailtype");
			if (type == "None" && this.toParseNode.attributes.name=="middleevent") {
				addOnReady();
			}
			//var strTag = (type) ? " Trigger=\"" + type + "\"":"";
			//return strTag;
			return type;
		}
		
		function getTriggerElement() {
			var trigger:XMLNode = toParseNode;
			var multiple = ParseOutUtils.getSubNode(trigger, "multiple");
			if (multiple) {
				getMultipleTrigger(multiple, evtNode);
			}else {
				var message = ParseOutUtils.getSubNode(trigger, "message");
				var timer = ParseOutUtils.getSubNode(trigger,"timer");
				var conditional = ParseOutUtils.getSubNode(trigger,"conditional");
				var signal = ParseOutUtils.getSubNode(trigger, "signal");
				var error = ParseOutUtils.getSubNode(trigger, "error");
				var compensation = ParseOutUtils.getSubNode(trigger, "compensation");
				getMessageTrigger(message, evtNode);
				getTimerTrigger(timer, evtNode);
				getConditionalTrigger(conditional, evtNode);
				getSignalTrigger(signal, evtNode);
				getErrorTrigger(error, evtNode);
				getCompensationTrigger(compensation, evtNode);
			}
		}
		
		function getResult() {
			//var type = getToParseSubNodeValue("eventdetailtype");
			//var strTag = (type) ? " Result=\""+type+"\"":"";
			//return strTag;
			return getToParseSubNodeValue("eventdetailtype")
		}
		
		function getAttached(node:XMLNode) {
			var isAttached = toParseNode.attributes.isattached;
			if (isAttached == "true") {
				var target = toParseNode.attributes.target;
				node.firstChild.attributes.Target = target;
				//node.firstChild.attributes.IsAttached = isAttached;
			}
		}
		
		
		
		function getMessageTrigger(trigger:XMLNode, owner:XMLNode) {
			//var TriggerResultMessage:XMLNode = new XMLNode(1, ElementParser.xpdl+"TriggerResultMessage");
			var TriggerResultMessage:XMLNode = new XMLNode(1, "TriggerResultMessage");
			var catchthrow:XMLNode;
			if (trigger) {
				var ApiaExtensions:XMLNode = new XMLNode(1, "ApiaExtensions");
				TriggerResultMessage.appendChild(ApiaExtensions);
				if (toParseNode.attributes.name == "middleevent") {
					var messagein:XMLNode = ParseOutUtils.getSubNode(trigger, "inmessageref");
					var messageout:XMLNode = ParseOutUtils.getSubNode(trigger, "outmessageref");
					if(messagein && TriggerResultMessage){
						getWebServiceCatchNode(messagein, TriggerResultMessage);
					}
					if (messageout) {
						getWebServiceThrowNode(trigger, TriggerResultMessage);
					}
				}else if (toParseNode.attributes.name == "endevent") {
					getWebServiceThrowNode(trigger, TriggerResultMessage);
				}else {
					getWebServiceCatchNode(trigger, TriggerResultMessage);
				}
				
				if (toParseNode.attributes.name=="startevent" || toParseNode.attributes.attached=="TRUE") {
					TriggerResultMessage.attributes.CatchThrow = "CATCH";
				}else if (toParseNode.attributes.name=="endevent" || toParseNode.attributes.attached=="FALSE") {
					TriggerResultMessage.attributes.CatchThrow = "THROW";
				}else if (toParseNode.attributes.name == "middleevent" || toParseNode.attributes.attached == "FALSE") {
					catchthrow = ParseOutUtils.getSubNode(trigger, "catchthrow");
					if(catchthrow){
						TriggerResultMessage.attributes.CatchThrow = catchthrow.attributes.value;
					}
				}
				
				var implementation = ParseOutUtils.getSubNodeValue(trigger, "implementation");
				if(implementation){
					owner.attributes[ElementParser.offline+"Implementation"] = implementation;
				}
				if(TriggerResultMessage.childNodes.length>1 || TriggerResultMessage.attributes.CatchThrow){
					owner.appendChild(TriggerResultMessage);
				}
			}else {
				if (toParseNode.attributes.name == "middleevent" || toParseNode.attributes.attached == "FALSE") {
					catchthrow = ParseOutUtils.getSubNode(toParseNode, "catchthrow");
					if(catchthrow){
						TriggerResultMessage.attributes.CatchThrow = catchthrow.attributes.value;
						owner.appendChild(TriggerResultMessage);
					}
				}
			}
		}
		
		function getTimerTrigger(trigger:XMLNode, owner:XMLNode) {
			if (trigger) {
				var TAid;
				var TriggerTimer:XMLNode = new XMLNode(1, "TriggerTimer");
				var initdate = ParseOutUtils.getSubNodeValue(trigger, "initdate");
				var enddate = ParseOutUtils.getSubNodeValue(trigger, "enddate");
				var timerattribute = ParseOutUtils.getSubNode(trigger, "timerattribute");
				if (timerattribute) {
					var TAvalue = ParseOutUtils.getSubNode(timerattribute, "value");
					TAid = ParseOutUtils.getSubNodeValue(TAvalue, "id");
					var TAname = ParseOutUtils.getSubNodeValue(TAvalue, "name");
					var TAtype = ParseOutUtils.getSubNodeValue(TAvalue, "type");
					if(TAid != null)
						TriggerTimer.attributes[ElementParser.apia + "TimerAttId"] = TAid;
					if(TAname != null)
						TriggerTimer.attributes[ElementParser.apia + "TimerAttName"] = TAname;
					var timerattributetype = ParseOutUtils.getSubNodeValue(trigger, "timerattributetype");
					if(timerattributetype != null)
						TriggerTimer.attributes[ElementParser.apia + "TimerAttType"] = timerattributetype;
				}
				if(initdate){
					TriggerTimer.attributes.TimeDate = initdate;
				}
				if(enddate){
					TriggerTimer.attributes[ElementParser.apia+"EndDate"] = enddate;
				}
				TriggerTimer.attributes["xmlns:apia"] = "http://www.statum.biz/2009/APIA.XPDL2.1";
				
				var unit = ParseOutUtils.getSubNodeValue(trigger, "unit");
				var value = ParseOutUtils.getSubNodeValue(trigger, "value");
				TriggerTimer.attributes[ElementParser.apia+"TimeUnit"] = unit;
				if(value){
					TriggerTimer.attributes.TimeCycle = value;
				}
				if(initdate || enddate || value ||TAid){
					owner.appendChild(TriggerTimer);
				}
				if(ElementParser.offline){
					delete(TriggerTimer.attributes["xmlns:apia"]);
				}
			}
		}
		
		function getConditionalTrigger(trigger:XMLNode, owner:XMLNode) {
			if (trigger) {
				var TriggerConditional:XMLNode = new XMLNode(1, "TriggerConditional");
				var name = ParseOutUtils.getSubNodeValue(trigger, "name");
				if (name) {
					TriggerConditional.attributes.ConditionName = name;
				}
				var expressionbody = ParseOutUtils.getSubNodeValue(trigger, "expressionbody");
				if (expressionbody) {
					var Expression:XMLNode = new XMLNode(1, "Expression");
					Expression.appendChild(new XMLNode(3, expressionbody));
				}
				owner.appendChild(TriggerConditional);
			}
		}
		
		function getSignalTrigger(trigger:XMLNode, owner:XMLNode) {
			if (trigger) {
				var TriggerResultSignal:XMLNode = new XMLNode(1, "TriggerResultSignal");
				var name = ParseOutUtils.getSubNodeValue(trigger, "name");
				if (name) {
					TriggerResultSignal.attributes.ConditionName = name;
				}
				owner.appendChild(TriggerResultSignal);
			}
		}
		
		function getMultipleTrigger(trigger:XMLNode, owner:XMLNode) {
			if (trigger) {
				var TriggerMultiple:XMLNode = new XMLNode(1, "TriggerMultiple");
				/*var message:XMLNode = ParseOutUtils.getSubNode(trigger, "multimessage");
				var timer:XMLNode = ParseOutUtils.getSubNode(trigger, "multitimer");
				var conditional:XMLNode = ParseOutUtils.getSubNode(trigger, "multiconditional");
				var signal:XMLNode = ParseOutUtils.getSubNode(trigger, "multisignal");
				var error:XMLNode = ParseOutUtils.getSubNode(trigger, "multierror");
				var compensation:XMLNode = ParseOutUtils.getSubNode(trigger, "multicompensation");
				getTriggers(message, TriggerMultiple,getMessageTrigger);
				getTriggers(timer, TriggerMultiple,getTimerTrigger);
				getTriggers(conditional, TriggerMultiple,getConditionalTrigger);
				getTriggers(signal, TriggerMultiple, getSignalTrigger);
				getTriggers(error, TriggerMultiple, getErrorTrigger);
				getTriggers(compensation, TriggerMultiple, getMultiCompensationTrigger)*/
				var message:XMLNode = ParseOutUtils.getSubNode(trigger, "multimessage");
				var timer:XMLNode = ParseOutUtils.getSubNode(trigger, "multitimer");
				getMessageTrigger(message, TriggerMultiple);
				getTimerTrigger(timer, TriggerMultiple);
				owner.appendChild(TriggerMultiple);
			}
		}
		
		function getErrorTrigger(trigger:XMLNode, owner:XMLNode) {
			if (trigger) {
				var ResultError:XMLNode = new XMLNode(1, "ResultError");
				var errorcode = ParseOutUtils.getSubNodeValue(trigger, "errorcode");
				if (errorcode) {
					ResultError.attributes.ErrorCode = errorcode;
				}
				owner.appendChild(ResultError);
			}
		}
		
		function getCompensationTrigger(trigger:XMLNode, owner:XMLNode) {
			if (trigger) {
				var TriggerResultCompensation:XMLNode = new XMLNode(1, "TriggerResultCompensation");
				
				var activitytype = ParseOutUtils.getSubNodeValue(trigger, "activitytype");
				if (activitytype) {
					TriggerResultCompensation.attributes.ActivityType = activitytype;
				}
				
				var activityreftask = ParseOutUtils.getSubNodeValue(trigger, "activityreftask");
				if (activityreftask) {
					TriggerResultCompensation.attributes.ActivityId = activityreftask;
				}
				var activityrefsubproc = ParseOutUtils.getSubNodeValue(trigger, "activityrefsubproc");
				if (activityrefsubproc) {
					TriggerResultCompensation.attributes.ActivityId = activityrefsubproc;
				}
				owner.appendChild(TriggerResultCompensation);
			}
		}
		
		function getMultiCompensationTrigger(trigger:XMLNode, owner:XMLNode) {
			trigger = ParseOutUtils.getSubNode(trigger, "activityref");
			if (trigger) {
				var TriggerResultCompensation:XMLNode = new XMLNode(1, "TriggerResultCompensation");
				var activitytype = ParseOutUtils.getSubNodeValue(trigger, "type");
				if (activitytype) {
					TriggerResultCompensation.attributes.ActivityType = activitytype;
				}
				var name = ParseOutUtils.getSubNodeValue(trigger, "name");
				if(name){
					TriggerResultCompensation.attributes.ActivityId = name;
				}
				owner.appendChild(TriggerResultCompensation);
			}
		}
		
		private function getTriggers(trigger:XMLNode, owner:XMLNode,fnc:Function) {
			if (trigger) {
				trigger = getValues(trigger);
				if (trigger) {
					for (var i:Number = 0; i < trigger.childNodes.length; i++ ) {
						fnc.call(null, trigger, owner);
					}
				}
			}
		}
		
		/*override public function getApiaTskEventsNode():XMLNode {
			var ApiaTskEvents:XMLNode = ParseOutUtils.getSubNode(parsedNode, "ApiaTskEvents");
			if (!ApiaTskEvents) {
				ApiaTskEvents = new XMLNode(1, "ApiaTskEvents");
				evtNode.appendChild(ApiaTskEvents);
			}
			return ApiaTskEvents;
		}*/
		
		private function addBusPool() {
			if(!View.getInstance().offline){
				var pool = "<Performers><Performer " + ElementParser.apia + "PerfId=\"2\" " + ElementParser.apia + "PerfName=\"busClass\" ";
				if(!View.getInstance().offline){
					pool += "xmlns:apia =\""+ElementParser.APIA_NAMESPACE+"\" ";
				}
				pool += "/></Performers>";
				var performers:XMLNode = ParseOutUtils.getParsedNode(pool);
				parsedNode.appendChild(performers);
			}
		}
	}
	
}
