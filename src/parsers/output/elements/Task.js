/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements {
	import flash.xml.XMLNode;
	import parsers.output.ParseOutUtils;
	import view.View;
	
	public class Task extends ActivityElement{
		
		private var implementationNode:XMLNode;
		
		private var TaskNode:XMLNode;
		
		public function Task() {
			addParseFunction(setAttached);
			addParseFunction(getApiaTskEvents);
			addParseFunction(getImplementation);
			addParseFunction(getTaskService);
			addParseFunction(getTaskSend);
			addParseFunction(getTaskReceive);
			addParseFunction(getTaskUser);
			addParseFunction(getTaskManual);
			addParseFunction(getTaskScript);
			addParseFunction(getRoleRef);
			super();
			addParseFunction(getFormsRef);
			addParseFunction(getApiaTskStates);
			addParseFunction(getApiaHighlightComments);
			addParseFunction(getTaskSchedule);
			addParseFunction(getSkipCondition);
			addParseFunction(getProEleId);
		}
		
		function getImplementation() {
			var name:XMLNode = getToParseSubNode("nameChooser");
			var values:XMLNode 
			var xpdlNS = View.getInstance().offline?(" xmlns:xpdl=\"" + ElementParser.XPDL_NAMESPACE) + "\" ":"";
			if(name){
				values= getValues(name);
			}else {
				name = getToParseSubNode("name");
			}
			var id = "";
			implementationNode = new XMLNode(1, (ElementParser.offline + "Implementation"));
			TaskNode = new XMLNode(1, (ElementParser.offline + "Task"));
			implementationNode.appendChild(TaskNode);
			if (!View.getInstance().offline && name) {
				var nameStr = name.attributes.value;
				if (name && values) {
					//id += " " + ElementParser.apia + "TskId=\"" + ParseOutUtils.getSubNode(values, "id").attributes.value + "\" " + ElementParser.apia + "TskName=\"" + ParseOutUtils.getSubNode(values, "name").attributes.value + "\"";
					if (!nameStr && ParseOutUtils.getSubNode(values, "name")) {
						nameStr = ParseOutUtils.getSubNode(values, "name").attributes.value;
					}
					TaskNode.attributes[ElementParser.apia + "TskId"] = ParseOutUtils.getSubNode(values, "id").attributes.value;
					
					//TaskNode.attributes[ElementParser.apia + "TskName"] = nameStr;
					TaskNode.attributes[ElementParser.apia + "TskName"] =  nameStr;
					TaskNode.attributes[ElementParser.apia + "TskTitle"] = ParseOutUtils.getSubNode(values, "label").attributes.value;
					
				} else if (name.attributes.value && name.attributes.value != "") {
					//id += " " + ElementParser.apia + "TskName=\"" + name.attributes.value + "\"";
					if (!nameStr && ParseOutUtils.getSubNode(values, "name")) {
						nameStr = ParseOutUtils.getSubNode(values, "name").attributes.value;
					}
					
					//TaskNode.attributes[ElementParser.apia + "TskName"] = ParseOutUtils.getSubNode(values, "name").attributes.value;
					TaskNode.attributes[ElementParser.apia + "TskTitle"] = ParseOutUtils.getSubNode(values, "label").attributes.value;
					TaskNode.attributes[ElementParser.apia + "TskName"] = ParseOutUtils.getSubNode(values, "name").attributes.value;
				}
			}
			
			//var strNode:String = "<"+ElementParser.offline+"Implementation"+xpdlNS+"><"+ElementParser.offline+"Task"+id+xpdlNS+">";
			/*var type = getToParseSubNodeValue("taskType");
			if (type) {
				strNode+="<"+type+" />"
			}*/
            //strNode += "</"+ElementParser.offline+"Task></"+ElementParser.offline+"Implementation>";
			//implementationNode = getParsedNode(strNode);
			//TaskNode = implementationNode.firstChild;
			parsedNode.appendChild(implementationNode);
			var type:String = getToParseSubNodeValue("taskType");
			if (View.getInstance().offline && type!="None") {
				var taskTypeNode:XMLNode=new XMLNode(1, (ElementParser.offline+"Task" + type));
				TaskNode.appendChild(taskTypeNode);
			}
		}
		
		function getFormsRef() {
			var steps:XMLNode = getToParseSubNode("steps");
			var FormsRef:XMLNode= new XMLNode(1, "FormsRef");
			var values:XMLNode= getValues(steps);
			if (values) {
				for (var u = 0; u < values.childNodes.length; u++ ) {
					var value = values.childNodes[u];
					var step:XMLNode = parseStep(value);
					//FormsRef.appendChild(step);
					for (var f = 0; f < step.childNodes.length; f++ ) {
						var el:XMLNode = step.childNodes[f].cloneNode(true);
						el.attributes.ProEleFrmStepId = u+1;
						FormsRef.appendChild(el);
					}
				}
				addApiaExtensions(TaskNode);
				if(FormsRef.childNodes.length>0){
					TaskNode.appendChild(FormsRef);
				}
				testApiaExtensions(TaskNode);
			}
		}
		
		private function parseStep(step:XMLNode) {
			var stepNode:XMLNode = new XMLNode(1, "Step");
			
			for (var i:Number = 0; i < step.childNodes.length; i++ ) {
				if (step.childNodes[i].attributes.name=="processforms") {
					getFormRefs("P", stepNode, step.childNodes[i])
				}else if (step.childNodes[i].attributes.name == "entityforms") {
					getFormRefs("E", stepNode, step.childNodes[i])
				}
				
			}
			
			return stepNode;
		}
		
		private function getFormRefs(type:String, stepNode:XMLNode, refs:XMLNode) {
			var values = getValues(refs);
			if (values) {
				var fCount = 0;
				for (var i:Number = 0; i < values.childNodes.length; i++ ) {
					var ref:XMLNode = getFormRef(values.childNodes[i]);
					ref.attributes["FrmType"] = type;
					ref.attributes.ProEleFrmOrder = fCount;
					fCount++;
					stepNode.appendChild(ref);
				}
			}
		}
		
		private function getFormRef(form:XMLNode) {
			var FormRef:XMLNode = new XMLNode(1, "FormRef");
			//FormRef.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
			for (var i:Number = 0; i<form.childNodes.length; i++) {
				var name = form.childNodes[i].attributes.name;
				if (name == "id") {
					FormRef.attributes["FrmId"] = form.childNodes[i].attributes.value;
				}else if (name == "name") {
					FormRef.attributes["FrmName"] = form.childNodes[i].attributes.value;
				}else if (name == "readonly") {
					FormRef.attributes["ProEleFrmReadOnly"] = (form.childNodes[i].attributes.value=="true").toString();
				}else if (name == "multiple") {
					FormRef.attributes["ProEleFrmMultiply"] = (form.childNodes[i].attributes.value=="true").toString();
				}else if (name == "condition") {
					var values = getValues(form.childNodes[i]);
					if (values && values.firstChild) {
						var value:String = values.firstChild.firstChild.nodeValue;
						if(value!=""){
							FormRef.attributes.ProEleFrmEvalCond = value;
							//FormRef.appendChild(new XMLNode(3, value));
						}
					}
				}else if (name == "documentation") {
					var docValues = getValues(form.childNodes[i]);
					if (docValues && docValues.firstChild) {
						var docValue:String = docValues.firstChild.firstChild;
						FormRef.attributes["ConditionDoc"] = docValue;
						//FormRef.appendChild(new XMLNode(3, docValue));
					}
				}
			}
			return FormRef;
		}
		
		function getApiaTskStates() {
			var ApiaTskStates:XMLNode = new XMLNode(1, "ApiaTskStates");
			var taskstates:XMLNode = getToParseSubNode("taskstates");
			var values:XMLNode = getValues(taskstates);
			if (values) {
				var addExt = false;
				for (var i:Number = 0; i < values.childNodes.length; i++ ) {
					var value:XMLNode = values.childNodes[i];
					var ApiaTskState:XMLNode = parseTskState(value);
					ApiaTskStates.appendChild(ApiaTskState);
					addExt = true;
				}
				if(addExt){
					addApiaExtensions(TaskNode);
				}
				TaskNode.appendChild(ApiaTskStates);
				testApiaExtensions(TaskNode);
			}
			
		}
		
		private function parseTskState(tskState:XMLNode) {
			var ApiaTskState:XMLNode = new XMLNode(1, "ApiaTskState");
			if(!View.getInstance().offline){
				ApiaTskState.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
			}
			for (var i:Number = 0; i < tskState.childNodes.length; i++ ) {
				var name = tskState.childNodes[i].attributes.name;
				if (name=="evtid") {
					ApiaTskState.attributes["EvtId"] = tskState.childNodes[i].attributes.value;
				}else if (name=="clsid") {
					ApiaTskState.attributes["EntStaId"] = tskState.childNodes[i].attributes.value;
				}else if (name=="evtname") {
					ApiaTskState.attributes["EvtName"] = tskState.childNodes[i].attributes.value;
				}else if (name == "clsname") {
					ApiaTskState.attributes["StaName"] = tskState.childNodes[i].attributes.value;
				}else if (name == "condition") {
					var condValues = getValues(tskState.childNodes[i]);
					if (condValues && condValues.firstChild) {
						var condValue:String = condValues.firstChild.firstChild.nodeValue;
						ApiaTskState.attributes["ProEleBusEntStaEvalCond"] = condValue;
					}
				}else if (name == "documentation") {
					var docValues = getValues(tskState.childNodes[i]);
					if (docValues && docValues.firstChild) {
						var docValue:String = docValues.firstChild.firstChild.nodeValue;
						ApiaTskState.attributes["ConditionDoc"] = docValue;
					}
				}
				
			}
			return ApiaTskState;
		}
		
		function getApiaTskEvents() {
			var Events:XMLNode = getApiaTskEventsNode();
			var bussinesClasses:XMLNode = getToParseSubNode("bussinessclasses");
			var values:XMLNode = getValues(bussinesClasses);
			if(values){
				for (var i:Number = 0; i < values.childNodes.length; i++ ) {
					var value:XMLNode = values.childNodes[i];
					var ApiaTskEvent:XMLNode = parseEventClass(value);
					ApiaTskEvent.attributes["ProEleEvtBusClaExecOrder"] = Events.childNodes.length;
					Events.appendChild(ApiaTskEvent);
				}
				//addApiaExtensions(TaskNode);
			}
			/*if (ApiaTskEvents.childNodes.length==0) {
				ApiaTskEvents.removeNode();
			}*/
		}
		
		function getApiaTskPools() {
			var ApiaTskPools:XMLNode = new XMLNode(1, "ApiaTskPools");
			var groups:XMLNode = getToParseSubNode("groups");
			var values:XMLNode = getValues(groups);
			if(values){
				for (var i:Number = 0; i < values.childNodes.length; i++ ) {
					var value:XMLNode = values.childNodes[i];
					var ApiaTskPool:XMLNode = new XMLNode(1, "ApiaTskPool");
					if(!View.getInstance().offline){
						ApiaTskPool.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
					}
					ApiaTskPools.appendChild(ApiaTskPool);
					for (var u = 0; u < value.childNodes.length; u++ ) {
						var name = value.childNodes[u].attributes.name;
						if (name == "id") {
							ApiaTskPool.attributes[ElementParser.apia+"PoolId"] = value.childNodes[u].attributes.value;
						}else if (name == "name") {
							ApiaTskPool.attributes[ElementParser.apia+"PoolName"] = value.childNodes[u].attributes.value;
						}else if (name == "condition") {
							var condValues = getValues(value.childNodes[u]);
							if (condValues && condValues.firstChild) {
								var condValue:String = condValues.firstChild.firstChild;
								ApiaTskPool.attributes.ProElePoolEvalCond = condValue;
								ApiaTskPool.appendChild(new XMLNode(3, condValue));
							}
						}
					}
				}
				parsedNode.appendChild(ApiaTskPools);
			}
		}
		
		function getRoleRef() {
			var RoleRef:XMLNode = new XMLNode(1, "RoleRef");
			/*if(!View.getInstance().offline){
				RoleRef.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
			}*/
			var role:XMLNode = getToParseSubNode("role");
			if(role){
				var values:XMLNode = getValues(role);
				if (role.attributes.value != "" && values && values.firstChild) {
					for (var i:Number = 0; i < values.firstChild.childNodes.length; i++ ) {
						var name = values.firstChild.childNodes[i].attributes.name;
						var val = values.firstChild.childNodes[i].attributes.value;
						if (name=="id") {
							RoleRef.attributes[ElementParser.apia+"RoleId"] = val;
						}else if (name == "name") {
							if (val == "") {
								val = role.attributes.value;
							}
							RoleRef.attributes[ElementParser.apia + "RoleName"] = val;							
						}
					}
					addApiaExtensions(TaskNode);
					TaskNode.appendChild(RoleRef);
					testApiaExtensions(TaskNode);
				}
			}
		}
		
		
		function getTaskService() {
			var taskservice:XMLNode = getToParseSubNode("service");
			if (taskservice) {
				var TaskService:XMLNode = new XMLNode(1, "TaskService");
				TaskNode.appendChild(TaskService);
				var messagein:XMLNode = ParseOutUtils.getSubNode(taskservice, "inmessageref");
				var messageout:XMLNode = ParseOutUtils.getSubNode(taskservice, "outmessageref");
				TaskService.attributes.Implementation = "WebService";
				
				var MessageIn:XMLNode = getMessage(messagein, "MessageIn");
				if(messagein){
					getWebServiceCatchNode(messagein, TaskService);
				}
				
				var MessageOut:XMLNode = getMessage(messageout, "MessageOut");
				if (messageout) {
					getWebServiceThrowNode(messageout, TaskService);
				}
				if (MessageIn) {
					addApiaExtensions(TaskService);
					TaskService.appendChild(MessageIn);
				}
				if (MessageOut) {
					addApiaExtensions(TaskService);
					TaskService.appendChild(MessageOut);
				}
				testApiaExtensions(TaskService);
				addBusPool();
			}
		}
		function getTaskReceive() {
			var taskreceive:XMLNode = getToParseSubNode("receive");
			if (taskreceive) {
				var TaskReceive:XMLNode = new XMLNode(1, "TaskReceive");
				TaskReceive.attributes.Implementation = "WebService";
				var message:XMLNode = ParseOutUtils.getSubNode(taskreceive, "messageref");
				
				if(message){
					getWebServiceCatchNode(message, TaskReceive);
				}
				
				var Message:XMLNode = getMessage(message, "Message");
				
				/*if(Message){
					addApiaExtensions(TaskReceive);
					TaskReceive.appendChild(Message);
				}*/
				TaskReceive.attributes.Instantiate = ParseOutUtils.getSubNodeValue(taskreceive, "instantiate")?"true":"false";
				TaskNode.appendChild(TaskReceive);
				addBusPool();
			}
		}
		function getTaskSend() {
			var tasksend:XMLNode = getToParseSubNode("send");
			if(tasksend){
				var TaskSend:XMLNode = new XMLNode(1, "TaskSend");
				TaskSend.attributes.Implementation = "WebService";
				var message:XMLNode = ParseOutUtils.getSubNode(tasksend, "messageref");

				var Message:XMLNode = getMessage(message, "Message");

				if (message) {
					getWebServiceThrowNode(message, TaskSend);
				}
				
				/*if (Message) {
					addApiaExtensions(TaskSend);
					TaskSend.appendChild(Message);
				}*/
				//TaskSend.attributes.Instantiate = ParseOutUtils.getSubNodeValue(tasksend, "instantiate");
				TaskNode.appendChild(TaskSend);
				addBusPool();
			}
		}
		function getTaskUser() {
			var taskuser:XMLNode = getToParseSubNode("user");
			if (taskuser) {
				var TaskUser:XMLNode = new XMLNode(1, "TaskUser");
				TaskNode.appendChild(TaskUser);
				var messagein:XMLNode = ParseOutUtils.getSubNode(taskuser, "inmessageref");
				var messageout:XMLNode = ParseOutUtils.getSubNode(taskuser, "outmessageref");
				
				var MessageIn:XMLNode = getMessage(messagein, "MessageIn");
				if(messagein){
					getWebServiceCatchNode(messagein, TaskUser);
				}
				
				var MessageOut:XMLNode = getMessage(messageout, "MessageOut");
				if (messageout) {
					getWebServiceThrowNode(messageout, TaskUser);
				}
			}
		}
		
		function getTaskScript() {
			var type = getToParseSubNodeValue("taskType");
			if (type=="Script" && !View.getInstance().offline) {
				var TaskScript:XMLNode = new XMLNode(1, ElementParser.xpdl + "TaskScript");
				TaskScript.appendChild(new XMLNode(1, ElementParser.xpdl + "Script"));
				TaskNode.appendChild(TaskScript);
				addBusPool();
				addOnReady("false");
			}
		}
		function getTaskManual() {
			var type = getToParseSubNodeValue("taskType");
			if (type == "Manual" && !View.getInstance().offline) {
				var TaskManual:XMLNode = new XMLNode(1, "TaskManual");
				TaskNode.appendChild(TaskManual);
			}
		}
		
		private function getMessage(msg:XMLNode, name:String):XMLNode {
			
			/*var Message:XMLNode = new XMLNode(1, name);
			var msgName = ParseOutUtils.getSubNodeValue(msg, "name");
			if (msgName){
				Message.attributes.Name = msgName;
			}
			var properties = ParseOutUtils.getSubNode(msg, "properties");
			var Properties:XMLNode;
			if(properties){
				//Properties = getWebServiceCatchNode(properties,Message);
			}
			if(msgName || Properties){
				return Message;
			}*/
			return null;
		}
		
		function setAttached() {
			var subElements:XMLNode = getToParseSubNode("subElements");
			if(subElements){
				for (var i:Number = 0; i < subElements.childNodes.length; i++ ) {
					if (subElements.childNodes[i] && subElements.childNodes[i].attributes.name=="middleevent") {
						subElements.childNodes[i].attributes.attached = toParseNode.attributes.id;
						var firsttask = ParseOutUtils.getSubNodeValue(toParseNode, "firsttask");
						if (firsttask == "true") {
							subElements.childNodes[i].attributes.firsttask = "true";
						}
					}
				}
			}
		}
		
		/*override public function getApiaTskEventsNode():XMLNode {
			var ApiaTskEvents:XMLNode = ParseOutUtils.getSubNode(parsedNode, "ApiaTskEvents");
			if (!ApiaTskEvents) {
				ApiaTskEvents = new XMLNode(1, "ApiaTskEvents");
				TaskNode.appendChild(ApiaTskEvents);
			}
			return ApiaTskEvents;
		}*/
		
		private function addBusPool() {
			if(!View.getInstance().offline){
				for (var p = 0; p < toParseNode.firstChild.childNodes.length; p++) {
					if (toParseNode.firstChild.childNodes[p].attributes.name=="performers") {
						var perfs:XMLNode = toParseNode.firstChild.childNodes[p];
						perfs = getValues(perfs);
						if (perfs) {
							perfs.removeNode();
						}
					}
				}
				
				for (var i:Number = 0; i < parsedNode.childNodes.length;i++ ) {
					if (parsedNode.childNodes[i].nodeName=="Performers") {
						return;
					}
				}
				var pool = "<Performers><Performer " + ElementParser.apia + "PerfId=\"2\" " + ElementParser.apia + "PerfName=\"busClass\" xmlns:apia=\"http://www.statum.biz/2009/APIA.XPDL2.1\" /></Performers>";
				var performers:XMLNode = ParseOutUtils.getParsedNode(pool);
				parsedNode.appendChild(performers);
			}
		}
		
		private function getApiaHighlightComments() {
			var highlightcomments:XMLNode = getToParseSubNode("highlightcomments");
			if (highlightcomments && highlightcomments.attributes.value && highlightcomments.attributes.value != "false" && (highlightcomments.attributes.value + "") != "undefined") {
				TaskNode.attributes[ElementParser.apia + "highlight_comments"] = highlightcomments.attributes.value;
			}
		}
		
		private function getTaskSchedule() {
			var scheduledTask:XMLNode = getToParseSubNode("scheduledTask");
			if (scheduledTask) {
				scheduledTask = scheduledTask.firstChild.firstChild;
				var tsk_sch_id = null;
				var asgn_type = null;
				var active_tsk_id = null;
				var active_prc_id = null;
				var active_prc_name = null;
				for (var i:Number = 0; i < scheduledTask.childNodes.length; i++ ) {
					if (scheduledTask.childNodes[i].attributes.name=="tsk_sch_id") {
						tsk_sch_id = scheduledTask.childNodes[i].attributes.value;
					}
					if (scheduledTask.childNodes[i].attributes.name=="asgn_type") {
						asgn_type = scheduledTask.childNodes[i].attributes.value;
					}
					if (scheduledTask.childNodes[i].attributes.name=="active_tsk_id") {
						active_tsk_id = scheduledTask.childNodes[i].attributes.value;
					}
					if (scheduledTask.childNodes[i].attributes.name=="active_prc_id") {
						active_prc_id = scheduledTask.childNodes[i].attributes.value;
					}
					if (scheduledTask.childNodes[i].attributes.name=="active_prc_name") {
						active_prc_name = scheduledTask.childNodes[i].attributes.value;
					}
				}
				if (tsk_sch_id && asgn_type && active_tsk_id && tsk_sch_id != "" && asgn_type != "" && active_tsk_id != "") {
					//var TASK_SCHEDULER:XMLNode = new XMLNode(1, ElementParser.apia + "TASK_SCHEDULER");
					var TASK_SCHEDULER:XMLNode = TaskNode;
					TASK_SCHEDULER.attributes[ElementParser.apia+"TskSchId"] = tsk_sch_id;
					TASK_SCHEDULER.attributes[ElementParser.apia+"AsignType"] = asgn_type;
					TASK_SCHEDULER.attributes[ElementParser.apia + "ActiveTskId"] = active_tsk_id;
					if (active_prc_id && active_prc_id != "") {
						TASK_SCHEDULER.attributes[ElementParser.apia + "ActivePrcId"] = active_prc_id;
					}
					if (active_prc_name && active_prc_name != "") {
						TASK_SCHEDULER.attributes[ElementParser.apia + "ActivePrcName"] = active_prc_name;
					}
					//TaskNode.appendChild(TASK_SCHEDULER);
				}
			}
		}
		
		private function getSkipCondition() {
			var conditionNode = getToParseSubNode("skipcondition");
			if (conditionNode) {
				var values:XMLNode = getValues(conditionNode);
				if(values){
					if (values.firstChild && values.firstChild.firstChild) {
						TaskNode.attributes[ElementParser.apia + "SkipTsk"] = "true";
						TaskNode.attributes[ElementParser.apia + "SkipTskCond"] = values.firstChild.firstChild.nodeValue;
					}
				}
			}
		}
		
		private function getProEleId() {
			var proeleid:XMLNode = getToParseSubNode("proeleid");
			if (proeleid && proeleid.attributes.value!="false" && (proeleid.attributes.value+"")!="undefined" && proeleid.attributes.value != "") {
				parsedNode.attributes[ElementParser.apia + "ProEleId"] = proeleid.attributes.value;
			}
		}
		
	}
	
}
