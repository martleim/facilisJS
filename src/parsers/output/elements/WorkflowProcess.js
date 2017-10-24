package parsers.output.elements 
{
	import flash.xml.XMLNode;
	import parsers.output.ParseOutUtils;
	import view.View;
	
	/**
	 * ...
	 * @author Martin Leiva
	 */
	public class WorkflowProcess  extends Activity{
		
		static var ApiaProEvents:XMLNode;

		public function WorkflowProcess() {
			super();
			addParseFunction(getWorkflowProcess);
			removeParseFunction(getObjectNode);
		}
		
		override function startParse():XMLNode {
			parsedNode = new XMLNode(1, (ElementParser.offline + "WorkflowProcess"));
			var ProcessHeader:XMLNode = new XMLNode(1, ElementParser.xpdl+"ProcessHeader");
			parsedNode.appendChild(ProcessHeader);
			geWFEvents();
			//this.callParseFunctions();
			//getWorkflowProcess();
			return parsedNode;
		}
		
		public function addWFEvents() {
			ApiaTskEvents = ApiaProEvents;
			addApiaEventsNode();
		}
		
		function getWorkflowProcess() {
			//var toParseXML:XMLNode = getToParseSubNode("processref");
			//if(toParseXML){
				/*var name:String;
				var bpmnNode:XMLNode = toParseNode.firstChild;
				for (var i:Number = 0; i < bpmnNode.childNodes.length; i++ ) {
					if (bpmnNode.childNodes[i].attributes.name == "name") {
						name = bpmnNode.childNodes[i].attributes.value;
					}
				}
				//var performers:XMLNode = ParseOutUtils.getSubNode(toParseXML, "performers");
				//var properties:XMLNode = ParseOutUtils.getSubNode(toParseXML, "properties");
				//var assignments:XMLNode = ParseOutUtils.getSubNode(toParseXML, "assignments");
				if (name) {
					parsedNode.attributes.Name = name;
				}
				if (View.getInstance().offline && toParseNode.attributes.mainpool == "true" && (!parsedNode.attributes.Name || parsedNode.attributes.Name == "")) {
					parsedNode.attributes.Name = "MainProcess";
				}*/
				//getPerformersNode(performers, parsedNode);
				//getPropertiesNode(properties,parsedNode);
				//getAssignmentsNode(assignments, parsedNode);
			//}
			
		}
		
		public function setMainWFObject() { 
			//if (toParseNode.attributes.mainpool=="true") {
				getObjectNode();
			//}
		}
	
		private function geWFEvents() {
			if(!View.getInstance().offline){
				var bussinesClasses:XMLNode = getToParseSubNode("bussinessclasses");
				if (bussinesClasses) {
					var Events:XMLNode = getApiaTskEventsNode();
					Events.nodeName = "ApiaProEvents";
					var values:XMLNode = getValues(bussinesClasses);
					if(values){
						for (var i:Number = 0; i < values.childNodes.length; i++ ) {
							var value:XMLNode = values.childNodes[i];
							var ApiaTskEvent:XMLNode = parseEventClass(value);
							ApiaTskEvent.attributes["ProEleEvtBusClaExecOrder"] = null;
							delete(ApiaTskEvent.attributes["ProEleEvtBusClaExecOrder"]);
							ApiaTskEvent.attributes["ProEvtBusClaExecOrder"] = Events.childNodes.length;
							ApiaTskEvent.nodeName = "ApiaProEvent";
							Events.appendChild(ApiaTskEvent);
						}
						ApiaProEvents = Events;
						//addApiaExtensions(TaskNode);
					}
				}
			}
		}
		
	}
	
}