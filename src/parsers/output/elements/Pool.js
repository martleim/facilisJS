/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements {
	import flash.xml.XMLNode;
	import parsers.output.ParseOutUtils;
	
	import parsers.output.ParserOut;

	public class Pool extends Activity{
		
		public function Pool() {
			addParseFunction(getLanes);
			super();
			addParseFunction(getProcess);
			addParseFunction(getOrientation);
			addParseFunction(getBoundary);
			addParseFunction(getParticipant);
		}
		
		override function startParse():XMLNode{
			parsedNode = new XMLNode(1, ElementParser.xpdl+"Pool");
			if (this.toParseNode.attributes.mainpool && this.toParseNode.attributes.mainpool=="true") {
				this.parsedNode.attributes.MainPool = "true";
			}
			if (toParseNode.attributes.mainpool=="true") {
				removeParseFunction(getObjectNode);
			}
			this.callParseFunctions();
			return parsedNode;
		}
		
		public function getLanes() {
			var subElements:XMLNode = this.getToParseSubNode("subElements");
			var lanes:XMLNode = new XMLNode(1, ElementParser.xpdl+"Lanes");
			if (subElements) {
				var laneY:Number = toParseNode.attributes.y as Number;
				var laneHeight:Number = (toParseNode.attributes.height as Number) / subElements.childNodes.length;
				for (var i:Number = 0; i < subElements.childNodes.length; i++ ) {
					var name = subElements.childNodes[i].attributes.name;
					if (name == "swimlane") {
						var laneParser:ElementParser = ParserOut.getElementParser(name);
						subElements.childNodes[i].attributes.x = toParseNode.attributes.x;
						subElements.childNodes[i].attributes.y = laneY;
						//subElements.childNodes[i].attributes.height = laneHeight;
						var lane:XMLNode = laneParser.parse(subElements.childNodes[i]);
						lanes.appendChild(lane);
						laneY += laneHeight;
					}
				}
			}
			if(lanes.childNodes.length>0){
				parsedNode.appendChild(lanes);
			}
		}
		
		function getProcess() {
			var process = toParseNode.attributes.process;
			if (process != null /*&& this.toParseNode.attributes.mainpool == "true"*/) {
				parsedNode.attributes.Process = process;
			}
		}
		function getOrientation() {
			parsedNode.attributes.Orientation = "HORIZONTAL" 
		}
		
		function getBoundary() {
			var boundaryvisible = getToParseSubNodeValue("boundaryvisible");
			parsedNode.attributes.BoundaryVisible = "true";
			if (boundaryvisible != null) {
				parsedNode.attributes.BoundaryVisible = boundaryvisible;
			}
			if (this.toParseNode.attributes.mainpool && this.toParseNode.attributes.mainpool=="true") {
				parsedNode.attributes.BoundaryVisible = "false";
			}
		}
		
		function getProcessRef() {
			var processref = getToParseSubNodeValue("processref");
			if (processref) {
				var ProcessRef = new XMLNode(1, "ProcessRef");
				ProcessRef.attributes.Name = ParseOutUtils.getSubNodeValue(processref, "name");
				ProcessRef.attributes.ProcessType = ParseOutUtils.getSubNodeValue(processref, "processtype");
				var performers = ParseOutUtils.getSubNode(processref, "performers");
				getPerformersNode(performers, ProcessRef);
			}
			if (toParseNode.attributes.mainpool == "true" && (!parsedNode.attributes.Name || parsedNode.attributes.Name == "")) {
				parsedNode.attributes.Name = "MainProcess";
			}
		}
		
		function getParticipant() {
			var participantref = getValues(getToParseSubNode("participantref"));
			if (participantref) {
				var name = ParseOutUtils.getSubNodeValue(participantref,"name");
				parsedNode.attributes.Participant = name;
			}
		}
		
	}
	
}
