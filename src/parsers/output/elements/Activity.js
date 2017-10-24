/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements {
	import flash.xml.*;
	import parsers.output.ParseOutUtils;
	import parsers.output.ParserOut;
	import parsers.Parser;
	import view.View;

	public class Activity extends ElementParser{
		
		var ApiaTskEvents:XMLNode;
		
		public function Activity() {
			super();
			addParseFunction(getInOutPutSets);
			addParseFunction(getAssignments);
			addParseFunction(getProEleDesignXML);
			addParseFunction(getNodeGraphicsInfo);
			addParseFunction(addApiaEventsNode);
		}
		
		override function startParse():XMLNode{
			parsedNode = new XMLNode(1, (ElementParser.offline+"Activity"));
			this.callParseFunctions();
			return parsedNode;
		}
		
		
		
		function getInOutPutSets() {
			/*var input:XMLNode; 
			var output:XMLNode;
			for (var i:Number = 0; i < toParseNode.childNodes.length;i++ ) {
				if (toParseNode.childNodes[i].nodeName=="InputSets") {
					input = toParseNode.childNodes[i];
				}
				if (toParseNode.childNodes[i].nodeName=="OutputSets") {
					output = toParseNode.childNodes[i];
				}
			}
			if (input && input.childNodes.length>0) {
				parsedNode.appendChild(input);
			}
			if (output && output.childNodes.length>0) {
				parsedNode.appendChild(output);
			}*/
		}
		
		function getWsPublications() {
			var webservices = getToParseSubNode("webservices");
			if (webservices) {
				var values:XMLNode = this.getValues(webservices);
				if (values) {
					var WsPublications:XMLNode = new XMLNode(1, "WsPublications");
					this.parsedNode.appendChild(WsPublications);
					for (var i:Number = 0; i < values.childNodes.length; i++ ) {
						var WsPublication:XMLNode = new XMLNode(1, "WsPublication");
						WsPublications.appendChild(WsPublication);
						var WsPublicationAttributes:XMLNode = new XMLNode(1, "WsPublicationAttributes");
						WsPublication.appendChild(WsPublicationAttributes);
						var value:XMLNode = values.childNodes[i];
						for (var u = 0; u < value.childNodes.length;u++ ) {
							var name = value.childNodes[u].attributes.name;
							if (name == "wsname") {
								WsPublication.attributes.WsName = value.childNodes[u].attributes.value;
							}else if (name == "processattributes") {
								parseWSAttributes(value.childNodes[u],WsPublicationAttributes, "P")
							}else if (name == "entityattributes") {
								parseWSAttributes(value.childNodes[u],WsPublicationAttributes, "E")
							}
						}
					}
				}
			}
		}
		
		private function parseWSAttributes(attsXML:XMLNode, WsPublicationAttributes:XMLNode, type:String) {
			var values:XMLNode = this.getValues(attsXML);
			if(values){
				for (var i:Number = 0; i < values.childNodes.length; i++ ) {
					var value:XMLNode = values.childNodes[i];
					var WsPublicationAttribute:XMLNode = new XMLNode(1, "WsPublicationAttribute");
					WsPublicationAttributes.appendChild(WsPublicationAttribute);
					WsPublicationAttribute.attributes.WsAttType = type;
					for (var u = 0; u < value.childNodes.length; u++ ) {
						var name = value.childNodes[u].attributes.name;
						var val = value.childNodes[u].attributes.value;
						if(val){
							if (name=="id") {
								WsPublicationAttribute.attributes.AttId = val;
							}else if (name=="name") {
								WsPublicationAttribute.attributes.AttName = val;
							}else if (name=="unique") {
								WsPublicationAttribute.attributes.WsAttUk = val;
							}else if (name=="multiple") {
								WsPublicationAttribute.attributes.Multivaluated = val;
							}
						}
					}
				}
			}
		}
		
		function getProEleDesignXML() {
			var x:Number = this.toParseNode.attributes.x;
			var y:Number = this.toParseNode.attributes.y;
			x = (x?x:0);
			y = (y?y:0);
			if(!View.getInstance().offline){
				parsedNode.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
				parsedNode.attributes[ElementParser.apia+"ProEleDesignXML"] = "DESIGN y="+Math.floor(y)+" x="+Math.floor(x)+"";
			}
		}
		
		function getAssignments() {
			var assignments:XMLNode;
			for (var p = 0; p < toParseNode.firstChild.childNodes.length; p++) {
				if (toParseNode.firstChild.childNodes[p].attributes.name=="assignments") {
					assignments = toParseNode.firstChild.childNodes[p];
				}
			}
			if(assignments){
				getAssignmentsNode(assignments, parsedNode);
			}
			
		}
		
		function getAssignmentsNode(assignments:XMLNode,parent:XMLNode) {
			var Assignments:XMLNode = new XMLNode(1, "Assignments");
			if(assignments){
				var values:XMLNode = getValues(assignments);
				if(values){
					for (var i:Number = 0; i < values.childNodes.length; i++ ) {
						var value:XMLNode = values.childNodes[i];
						Assignments.appendChild(getAssignment(value));
					}
					parent.appendChild(Assignments);
				}
			}
		}
		
		private function getAssignment(assignment:XMLNode ):XMLNode {
			var Assignment:XMLNode = new XMLNode(1, "Assignment");
			var from:XMLNode = ParseOutUtils.getSubNode(assignment, "from");
			var to:XMLNode = ParseOutUtils.getSubNode(assignment, "to");
			var expressionbody=ParseOutUtils.getSubNodeValue(from,"expressionbody");
			
			var assigntime = ParseOutUtils.getSubNodeValue(assignment, "assigntime");
			Assignment.attributes.AssignTime = assigntime;
			var Target:XMLNode = new XMLNode(1, "Target");
			var values:XMLNode = getValues(to);
			for (var i:Number = 0; i < values.childNodes.length; i++ ) {
				var name = values.childNodes[i].attributes.name;
				var value = values.childNodes[i].attributes.value;
				if(name=="name"){
					Target.attributes.Name = value;
				}else if(name=="type"){
					Target.attributes.Type = value;
				}else if(name=="targettype"){
					Target.attributes.TargetType = value;
				}else if(name=="index"){
					Target.attributes.Index = value;
				}else if(name=="value"){
					Target.attributes.Value = value;
				}else if(name=="correlation"){
					Target.attributes.Correlation = value;
				}
			}
			var Expression:XMLNode = new XMLNode(1, "Expression");
			if (expressionbody) {
				Expression.appendChild(new XMLNode(3, expressionbody));
			}
			
			Assignment.appendChild(Target);
			Assignment.appendChild(Expression);
			return Assignment;
		}
		
		function getPerformers() {
			//var performers:XMLNode = ParseOutUtils.getSubNode(toParseNode, "performers");
			var performers:XMLNode;
			if (toParseNode.firstChild) {
				for (var p = 0; p < toParseNode.firstChild.childNodes.length; p++) {
					if (toParseNode.firstChild.childNodes[p].attributes.name=="performers") {
						performers = toParseNode.firstChild.childNodes[p];
					}
				}
				if (performers && (performers.childNodes.length > 0 || performers.attributes.type == "text") ){
					getPerformersNode(performers, parsedNode);
				}
			}
		}
		
		function getPerformersNode(performers:XMLNode, parent:XMLNode) {
			if (performers) {
				if (performers.attributes.type == "text") {
					if (performers.attributes.value=="" || (performers.attributes.value+"")=="undefined") {
						return;
					}
					
					var perfName:String = (performers.attributes.value as String);// .toUpperCase();
					
					var PerformersSingle:XMLNode = new XMLNode(1, ElementParser.xpdl+"Performers");
					var PerformerSingle:XMLNode = new XMLNode(1, ElementParser.xpdl+"Performer");
					var PerformerName:XMLNode = new XMLNode(3, perfName);
					
					PerformerSingle.appendChild(PerformerName);
					PerformersSingle.appendChild(PerformerSingle);
					var beforeSingle:XMLNode;
					for (var s = 0; s < parent.childNodes.length; s++ ) {
						if (parent.childNodes[s].localName.indexOf("TransitionRestriction") >= 0) {
							beforeSingle = parent.childNodes[s];
						}
					}
					if (beforeSingle) {
						parent.insertBefore(PerformersSingle, beforeSingle);
					}else {
						parent.appendChild(PerformersSingle);
					}
					ParserOut.addParticipant(View.getInstance().getUniqueId(), PerformerName);
					return;
				}
				performers = getValues(performers);
				if (performers) {
					var Performers:XMLNode = getParsedPerformers(parent);
					for (var i:Number = 0; i < performers.childNodes.length; i++ ) {
						var Performer:XMLNode = new XMLNode(1, ElementParser.offline+"Performer");
						//Performer.attributes["xmlns:xpdl"] = "http://www.wfmc.org/2008/XPDL2.1";
						var id:String = ParseOutUtils.getSubNodeValue(performers.childNodes[i], "perfid");
						if(id && !View.getInstance().offline){
							Performer.attributes[ElementParser.apia + "PerfId"] = id;
						}
						var name:String = ParseOutUtils.getSubNodeValue(performers.childNodes[i], "perfname");
						if(name && !View.getInstance().offline){
							Performer.attributes[ElementParser.apia + "PerfName"] = name;
						}
						var participant=ParserOut.addParticipant(id, name);
						if (View.getInstance().offline) {
							//Performer.appendChild(new XMLNode(3, name));
							Performer.appendChild(new XMLNode(3, (participant.attributes.Id+"")));
						}
						/*if(!View.getInstance().offline){
							Performer.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
						}
						//Performer.attributes.ProElePerfEvalCond = ParseOutUtils.getSubNodeValue(performers.childNodes[i], "condition");
						
						/*var documentation = ParseOutUtils.getSubNode(performers.childNodes[i], "documentation");
						var Documentation:XMLNode = getDocumentationNode(documentation);						
						if (Documentation) {
							Performer.appendChild(Documentation);
						}*/
						
						var condValues = getValues(ParseOutUtils.getSubNode(performers.childNodes[i], "condition"));
						if (condValues && condValues.firstChild) {
							var condValue:String = condValues.firstChild.firstChild.nodeValue;
							Performer.attributes[ElementParser.apia+"ProElePerfEvalCond"] = condValue;
						}
						
						var docValues = getValues(ParseOutUtils.getSubNode(performers.childNodes[i], "documentation"));
						if (docValues && docValues.firstChild) {
							var docValue:String = docValues.firstChild.firstChild.nodeValue;
							Performer.attributes[ElementParser.apia+"ConditionDoc"] = docValue;
						}
						if(!(!name && !id && !condValues && !docValues)){
							Performers.appendChild(Performer);
						}
					}
					i = 0;
					var before:XMLNode;
					for (i = 0; i < parent.childNodes.length; i++ ) {
						if (parent.childNodes[i].localName.indexOf("TransitionRestriction") >= 0) {
							before = parent.childNodes[i];
						}
					}
					if (before && before.nextSibling) {
						parent.insertBefore(Performers, before);
					}else {
						parent.appendChild(Performers);
					}
				}
			}
		}
		
		function getParsedPerformers(node:XMLNode):XMLNode {
			var Performers:XMLNode;
			for (var i:Number = 0; i < node.childNodes.length;i++ ) {
				if (node.childNodes[i].nodeName == "Performers") {
					return node.childNodes[i];
				}
			}
			Performers = new XMLNode(1, ElementParser.offline+"Performers")
			node.appendChild(Performers);
			return Performers;
		}
		
		
		
		function getWebServiceCatchNode(node:XMLNode,parent:XMLNode) {
			getCatchWS(node, parent);
		}
		
		function getCatchWS(messagecatch:XMLNode, parent:XMLNode) {
			addApiaExtensions(parent);
			var WebServiceMapping:XMLNode = ParseOutUtils.getSubNode(parent,"WebServiceMapping");
			if (!WebServiceMapping) {
				WebServiceMapping = new XMLNode(1, "WebServiceMapping");
				parent.appendChild(WebServiceMapping);
			}
			var parsedWS:XMLNode = parseWS(messagecatch.firstChild);
			if(parsedWS){
				WebServiceMapping.appendChild(parsedWS);
			}
			if (WebServiceMapping.childNodes.length==0) {
				WebServiceMapping.removeNode();
			}
			testApiaExtensions(parent);
		}
		
		private function parseWS(ws:XMLNode) {
			var pro = (toParseNode.attributes.name == "startevent");
			if (toParseNode.attributes.name == "task" ) {
				var firsttask = ParseOutUtils.getSubNodeValue(toParseNode, "firsttask");
				pro = (firsttask == "true");
			}
			if (toParseNode.attributes.name == "middleevent" && toParseNode.attributes.firsttask == "true") {
				pro = true;
			}
			var wsNode:XMLNode = new XMLNode(1, "WEBSERVICE_" + (pro?"PRO":"TSK"));
			for (var i:Number = 0; i < ws.childNodes.length; i++ ) {
				if(ws.childNodes[i].attributes.name=="wsname"){
					wsNode.attributes.ws_method_name = ws.childNodes[i].attributes.value;
				}else if (ws.childNodes[i].attributes.name=="processattributes") {
					getWsAtts("P", wsNode, ws.childNodes[i])
				}else if (ws.childNodes[i].attributes.name == "entityattributes") {
					getWsAtts("E", wsNode, ws.childNodes[i])
				}
			}
			if(wsNode.attributes.ws_method_name){
				return wsNode;
			}
		}
		
		private function getWsAtts(type:String, wsNode:XMLNode, atts:XMLNode) {
			var values = getValues(atts);
			if(values){
				for (var i:Number = 0; i < values.childNodes.length; i++ ) {
					var att:XMLNode = getWsAtt(values.childNodes[i],type);
					wsNode.appendChild(att);
				}
			}
		}
		
		private function getWsAtt(att:XMLNode, type:String) {
			var pro = (toParseNode.attributes.name == "startevent");
			if (toParseNode.attributes.name == "task") {
				var firsttask = ParseOutUtils.getSubNodeValue(toParseNode,"firsttask");
				pro = (firsttask == "true");
			}
			if (toParseNode.attributes.name == "middleevent" && toParseNode.attributes.firsttask == "true") {
				pro = true;
			}
			var attName = "WS_ATTRIBUTE_"+(pro?"PRO":"TSK");
			var attribute:XMLNode = new XMLNode(1, attName);
			attribute.attributes["attribute_uk"] = "F";
			attribute.attributes["multivalued"] = "F";
			for (var i:Number = 0; i<att.childNodes.length; i++) {
				var name = att.childNodes[i].attributes.name;
				attribute.attributes["attribute_type"] = type;
				if (name == "id") {
					attribute.attributes["attribute_id"] = att.childNodes[i].attributes.value;
				}else if (name == "name") {
					attribute.attributes["name"] = att.childNodes[i].attributes.value;
				}else if (name == "uk") {
					attribute.attributes["attribute_uk"] = (att.childNodes[i].attributes.value=="true")?"T":"F";
				}else if (name == "multivalued") {
					attribute.attributes["multivalued"] = (att.childNodes[i].attributes.value=="true")?"T":"F";
				}
			}
			return attribute;
		}
		
		
		/*function getWebServiceThrowNode(messagethrow:XMLNode, parent:XMLNode) {
			
			var WebServiceThrow:XMLNode = new XMLNode(1, "WebServiceThrow");
			var messageref = ParseOutUtils.getSubNode(messagethrow, "messageref");
			if (messagethrow) {
				var add = false;
				var name = ParseOutUtils.getSubNodeValue(messagethrow, "name");
				var method = ParseOutUtils.getSubNodeValue(messagethrow, "method")
				var wsdl = ParseOutUtils.getSubNodeValue(messagethrow, "wsdl");
				add = (name || method || wsdl);
				if(name){
					WebServiceThrow.attributes.ServiceName = name;
				}
				if(method){
					WebServiceThrow.attributes.ServiceOperation = method;
				}
				if(wsdl){
					WebServiceThrow.attributes.WSDL = wsdl;
				}
				
				var parameters = ParseOutUtils.getSubNode(messagethrow, "parameters");
				if (parameters) {
					add = true;
					var Parameters:XMLNode = new XMLNode(1, "Parameters");
					var paramname = ParseOutUtils.getSubNodeValue(parameters, "paramname");
					var description = ParseOutUtils.getSubNodeValue(parameters, "description");
					var paramtype = ParseOutUtils.getSubNodeValue(parameters, "paramtype");
					var inout = ParseOutUtils.getSubNodeValue(parameters, "inout");
					var value = ParseOutUtils.getSubNodeValue(parameters, "value");
					
					var properties = ParseOutUtils.getSubNode(parameters, "properties");
					
					if(paramname){
						Parameters.attributes.ParameterName = paramname;
					}
					if(paramname){
						Parameters.attributes.Description = description;
					}
					if(paramname){
						Parameters.attributes.ParameterType = paramtype;
					}
					if(paramname){
						Parameters.attributes.Direction = inout;
					}
					if(paramname){
						Parameters.attributes.Value = value;
					}
					if (properties) {
						var Props:XMLNode = new XMLNode(1, "props");
						getPropertiesNode(properties, Props);
						if (Props && Props.childNodes.length) {
							for (var i:Number = 0; i < Props.childNodes.length; i++ ) {
								Parameters.appendChild(Props.childNodes[i]);
							}
						}
					}
					WebServiceThrow.appendChild(Parameters);
				}
				if(add){
					var WebServiceMapping:XMLNode = ParseOutUtils.getSubNode(parent,"WebServiceMapping");
					if (!WebServiceMapping) {
						WebServiceMapping = new XMLNode(1, "WebServiceMapping");
						parent.appendChild(WebServiceMapping);
					}
					WebServiceMapping.appendChild(WebServiceThrow);
				}
			}
		}*/
		
		
		function getWebServiceThrowNode(messagethrow:XMLNode, parent:XMLNode) {
			getThrowWS(messagethrow, parent);
			/*var wsName = toParseNode.attributes.name == "startevent"?"PRO":"TSK";
			var WebServiceThrow:XMLNode = new XMLNode(1, "WEBSERVICE_"+wsName);
			var messageref = ParseOutUtils.getSubNode(messagethrow, "messageref");
			if (messagethrow) {
				var add = false;
				var name = ParseOutUtils.getSubNodeValue(messagethrow, "name");
				var method = ParseOutUtils.getSubNodeValue(messagethrow, "method")
				var wsdl = ParseOutUtils.getSubNodeValue(messagethrow, "wsdl");
				add = (name || method || wsdl);
				if(name){
					WebServiceThrow.attributes.name = name;
				}
				if(method){
					WebServiceThrow.attributes.ws_method_name = method;
				}
				if(wsdl){
					WebServiceThrow.attributes.wsdl = wsdl;
				}
				var properties:XMLNode = ParseOutUtils.getSubNode(messagethrow, "properties");
				properties = getValues(properties);
				var Properties:XMLNode = WebServiceThrow;
				if (properties && properties.childNodes.length > 0) {
					for (var i:Number = 0; i < properties.childNodes.length; i++ ) {
						add = true;
						var Property:XMLNode = new XMLNode(1, "WS_ATTRIBUTE_"+wsName);
						var nodes:XMLNode = properties.childNodes[i];// ParseOutUtils.getSubNode(properties.childNodes[i], "values");
						var id = ParseOutUtils.getSubNodeValue(nodes, "id");
						name = ParseOutUtils.getSubNodeValue(nodes, "name");
						var type = ParseOutUtils.getSubNodeValue(nodes, "type");
						var propertytype = ParseOutUtils.getSubNodeValue(nodes, "propertytype");
						var value = ParseOutUtils.getSubNodeValue(nodes, "value");
						var correlation = ParseOutUtils.getSubNodeValue(nodes, "correlation");
						var uk = ParseOutUtils.getSubNodeValue(nodes, "uk");
						var multivalued = ParseOutUtils.getSubNodeValue(nodes, "multivalued");
						var index = ParseOutUtils.getSubNodeValue(nodes, "index");
						if(id){
							Property.attributes.attribute_id = id;
						}
						if(name){
							Property.attributes.name = name;
						}
						if(type){
							Property.attributes.Type = type;
						}
						if(propertytype){
							Property.attributes.attribute_type = propertytype;
						}
						if(value){
							Property.attributes.Value = value;
						}
						if(correlation){
							Property.attributes.Correlation = correlation;
						}
						if(uk){
							Property.attributes.attribute_uk = (uk=="true")?"T":"F";
						}
						if(multivalued){
							Property.attributes.multivalued = (multivalued=="true")?"T":"F";
						}
						if(index){
							Property.attributes.Index = index;
						}
						Properties.appendChild(Property);
					}
				}
				if(add){
					var WebServiceMapping:XMLNode = ParseOutUtils.getSubNode(parent,"WebServiceMapping");
					if (!WebServiceMapping) {
						WebServiceMapping = new XMLNode(1, "WebServiceMapping");
						parent.appendChild(WebServiceMapping);
					}
					WebServiceMapping.appendChild(WebServiceThrow);
				}
			}*/
			
			
			
		}
		
		
		function getThrowWS(messagethrow:XMLNode, parent:XMLNode) {
			var wsClasses:XMLNode = ParseOutUtils.getSubNode(messagethrow, "wsclasses");
			var Events:XMLNode = getApiaTskEventsNode();
			var values:XMLNode = getValues(wsClasses);
			if (values && values.childNodes.length>0) {
				addOnReady();
				for (var i:Number = 0; i < values.childNodes.length; i++ ) {
					var value:XMLNode = values.childNodes[i];
					var ApiaTskEvent:XMLNode = getWSClass(value);
					ApiaTskEvent.attributes["ProEleEvtBusClaExecOrder"] = Events.childNodes.length;
					Events.appendChild(ApiaTskEvent);
				}
			}
		}
		
		private function getWSClass(evtClass:XMLNode) {
			var ApiaTskEvent:XMLNode = new XMLNode(1, "ApiaEvent");
			//ApiaTskEvent.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
			ApiaTskEvent.attributes["EvtName"] = "ONCOMPLETE";
			ApiaTskEvent.attributes["EvtId"] = "10";
			ApiaTskEvent.attributes["WS"] = "true";
			for (var i:Number = 0; i < evtClass.childNodes.length; i++ ) {
				//trace("evtClass.childNodes[i]  "+evtClass.childNodes[i]);
				var name = evtClass.childNodes[i].attributes.name;
				if (name=="clsid") {
					ApiaTskEvent.attributes["BusClaId"] = evtClass.childNodes[i].attributes.value;
				}else if (name == "clsname") {
					ApiaTskEvent.attributes["BusClaName"] = evtClass.childNodes[i].attributes.value;
				}else if (name == "binding") {
					getWSBindings(evtClass.childNodes[i],ApiaTskEvent)
				}
			}
			return ApiaTskEvent;
		}
		
		private function getWSBindings(node:XMLNode, parent:XMLNode) {
			var values:XMLNode = getValues(node);
			if(values && values.childNodes.length>0){
				var BusClaParBindings:XMLNode = new XMLNode(1,"BusClaParBindings");
				for (var i:Number = 0; i < values.childNodes.length;i++ ) {
					var value:XMLNode = values.childNodes[i];
					var BusClaParBinding:XMLNode = new XMLNode(1, "BusClaParBinding");
					//BusClaParBinding.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
					BusClaParBindings.appendChild(BusClaParBinding);
					//BusClaParBinding.attributes["Multivalued"] = "false";
					for (var u = 0; u < value.childNodes.length; u++ ) {
						//BusClaParId="1530" BusClaParName="par" BusClaParType="S" BusClaParBndId="1601">11
						var name = value.childNodes[u].attributes.name;
						var val = value.childNodes[u].attributes.value;
						if(val){
							if (name == "id") {
								BusClaParBinding.attributes["BusClaParId"] = val;
							}else if (name=="param") {
								BusClaParBinding.attributes["BusClaParName"] = val;
							}else if (name=="type") {
								BusClaParBinding.attributes["BusClaParType"] = val;
							}else if (name == "value") {
								BusClaParBinding.attributes["BusClaParBndValue"] = val;
								BusClaParBinding.attributes["BusClaParBndType"] = "V";
							}else if (name == "attribute") {
								BusClaParBinding.attributes["AttName"] = val;
								BusClaParBinding.attributes["BusClaParBndType"] = (((value.childNodes[u].attributes.atttype + "") .toLowerCase())=="process")?"P":"E";
							}else if (name == "attributeid") {
								BusClaParBinding.attributes["AttId"] = val;
							}else if (name == "uk") {
								BusClaParBinding.attributes["UK"] = (val=="true").toString();
							}else if (name == "multivalued") {
								BusClaParBinding.attributes["Multivalued"] = (val=="true").toString();
							}
						}
					}
				}
				parent.appendChild(BusClaParBindings);
			}
		}
		
		
		
		/*function getProEleId() {
			var proeleid = toParseNode.attributes.proeleid;
			if (proeleid) {
				//parsedNode.attributes.ProEleId = proeleid;
			}
		}*/
		
		public function getApiaTskEventsNode():XMLNode {
			//ApiaTskEvents = ParseOutUtils.getSubNode(parsedNode, "ApiaEvents");
			if (!ApiaTskEvents) {
				ApiaTskEvents = new XMLNode(1, "ApiaEvents");
			}
			return ApiaTskEvents;
		}
		
		function parseEventClass(evtClass:XMLNode) {
			var ApiaTskEvent:XMLNode = new XMLNode(1, "ApiaEvent");
			//ApiaTskEvent.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
			for (var i:Number = 0; i < evtClass.childNodes.length; i++ ) {
				var name = evtClass.childNodes[i].attributes.name;
				if (name=="evtid") {
					ApiaTskEvent.attributes["EvtId"] = evtClass.childNodes[i].attributes.value;
				}else if (name=="clsid") {
					ApiaTskEvent.attributes["BusClaId"] = evtClass.childNodes[i].attributes.value;
				}else if (name=="evtname") {
					ApiaTskEvent.attributes["EvtName"] = evtClass.childNodes[i].attributes.value;
				}else if (name == "clsname") {
					ApiaTskEvent.attributes["BusClaName"] = evtClass.childNodes[i].attributes.value;
				}else if (name == "binding") {
					parseBindings(evtClass.childNodes[i],ApiaTskEvent)
				}else if (name == "skipcondition") {
					var values:XMLNode = getValues(evtClass.childNodes[i]);
					if(values){
						if (values.firstChild && values.firstChild.firstChild && values.firstChild.firstChild.nodeValue) {
							ApiaTskEvent.attributes["SkipCond"] = values.firstChild.firstChild.nodeValue;
						}
					}
				}
			}
			return ApiaTskEvent;
		}
		
		private function parseBindings(node:XMLNode, parent:XMLNode) {
			var values:XMLNode = getValues(node);
			if(values && values.childNodes.length>0){
				var BusClaParBindings:XMLNode = new XMLNode(1,"BusClaParBindings");
				for (var i:Number = 0; i < values.childNodes.length;i++ ) {
					var value:XMLNode = values.childNodes[i];
					var BusClaParBinding:XMLNode = new XMLNode(1, "BusClaParBinding");
					//BusClaParBinding.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
					BusClaParBindings.appendChild(BusClaParBinding);
					for (var u = 0; u < value.childNodes.length; u++ ) {
						//BusClaParId="1530" BusClaParName="par" BusClaParType="S" BusClaParBndId="1601">11
						var name = value.childNodes[u].attributes.name;
						var val = value.childNodes[u].attributes.value;
						if(val){
							if (name == "id") {
								BusClaParBinding.attributes["BusClaParId"] = val;
							}else if (name=="param") {
								BusClaParBinding.attributes["BusClaParName"] = val;
							}else if (name=="type") {
								BusClaParBinding.attributes["BusClaParType"] = val;
							}else if (name == "value") {
								BusClaParBinding.attributes["BusClaParBndValue"] = val;
								BusClaParBinding.attributes["BusClaParBndType"] = "V";
							}else if (name == "attribute") {
								BusClaParBinding.attributes["AttName"] = val;
								BusClaParBinding.attributes["BusClaParBndType"] = (((value.childNodes[u].attributes.atttype + "") .toLowerCase())=="process")?"P":"E";
							}else if (name == "attributeid") {
								BusClaParBinding.attributes["AttId"] = val;
							}else if (name == "attributetooltip") {
								BusClaParBinding.attributes["AttTooltip"] = val;
							}
						}
					}
				}
				parent.appendChild(BusClaParBindings);
			}
		}
		
		function addApiaEventsNode() {
			if (ApiaTskEvents && ApiaTskEvents.childNodes.length > 0) {
				addApiaExtensions(parsedNode);
				parsedNode.appendChild(ApiaTskEvents);
				testApiaExtensions(parsedNode);
			}	
		}
		
		function addApiaExtensions(to:XMLNode) {
			for (var i:Number = 0; i < to.childNodes.length; i++ ) {
				if (to.childNodes[i].nodeName=="ApiaExtensions") {
					return;
				}
			}
			var ApiaExtensions:XMLNode = new XMLNode(1, "ApiaExtensions");
			to.appendChild(ApiaExtensions);
		}
		
		function testApiaExtensions(to:XMLNode) {
			for (var i:Number = 0; i < to.childNodes.length; i++ ) {
				if (to.childNodes[i].nodeName == "ApiaExtensions" && (to.childNodes.length - 1) == i) {
					to.childNodes[i].removeNode();
				}
			}
		}
		
		function getNodeGraphicsInfo() {
			var x = this.toParseNode.attributes.x;
			var y = this.toParseNode.attributes.y;
			var width = this.toParseNode.attributes.width;
			var height = this.toParseNode.attributes.height;
			x = (x?x:0);
			y = (y?y:0);
			width = (width?width:0);
			height = (height?height:0);
			//var xmlStr = "<NodeGraphicsInfos><NodeGraphicsInfo Height=\""+height+"\" Width=\""+width+"\" ><Coordinates XCoordinate=\""+x+"\" YCoordinate=\""+y+"\" /></NodeGraphicsInfo></NodeGraphicsInfos>";
			var NodeGraphicsInfos:XMLNode = new XMLNode(1, ElementParser.xpdl+"NodeGraphicsInfos");
			var NodeGraphicsInfo:XMLNode = new XMLNode(1, ElementParser.xpdl+"NodeGraphicsInfo");
			NodeGraphicsInfo.attributes.Height = height;
			NodeGraphicsInfo.attributes.Width = width;
			NodeGraphicsInfo.attributes.Width = width;
			var Coordinates:XMLNode = new XMLNode(1, ElementParser.xpdl+"Coordinates");
			Coordinates.attributes.XCoordinate = x;
			Coordinates.attributes.YCoordinate = y;
			NodeGraphicsInfo.appendChild(Coordinates);
			NodeGraphicsInfos.appendChild(NodeGraphicsInfo);
			parsedNode.appendChild(NodeGraphicsInfos);
			getColor(NodeGraphicsInfo);
		}
		
		private function getColor(NodeGraphicsInfo:XMLNode) {
			var bpmnNode:XMLNode = toParseNode.firstChild;
			var colorFill:XMLNode = ParseOutUtils.getSubNode(bpmnNode, "colorFill");
			if (colorFill) {
				NodeGraphicsInfo.attributes.FillColor = colorFill.attributes.value;
			}
		}
		
		function addOnReady(ws_att:String = "true") {
			if(!View.getInstance().offline){
				var Events:XMLNode = getApiaTskEventsNode();
				var event:XMLNode = new XMLNode(1, "ApiaEvent");
				event.attributes["ProEleEvtBusClaExecOrder"] = Events.childNodes.length;
				event.attributes["EvtName"] = "ONREADY";
				event.attributes["EvtId"] = "11";
				event.attributes["WS"] = ws_att;
				event.attributes["BusClaId"] = "102";
				event.attributes["BusClaName"] = "BPMNAutoComplete";
				for (var i:Number = 0; i < Events.childNodes.length; i++ ) {
					if (Events.childNodes[i].attributes["BusClaName"]=="BPMNAutoComplete") {
						return;
					}
				}
				Events.appendChild(event);
			}
		}
		
		
	}
	
}
