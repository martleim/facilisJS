/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements {
	import flash.xml.XMLNode;
	import view.View;

	public class Transition extends ElementParser{
		
		public function Transition() {
			addParseFunction(getStartEnd);
			addParseFunction(getType);
			addParseFunction(getCondition);
			addParseFunction(getExecutionOrder);
			super();
			addParseFunction(getVertexes);
		}
		
		override function startParse():XMLNode{
			parsedNode = new XMLNode(1, (ElementParser.offline+"Transition"));
			this.callParseFunctions();
			return parsedNode;
		}
		
		function getStartEnd() {
			var startid = toParseNode.attributes.startid;
			var endid = toParseNode.attributes.endid;
			parsedNode.attributes.From = startid;
			parsedNode.attributes.To = endid;
		}
		
		function getCondition() {
			var conditiontype = getToParseSubNodeValue("conditiontype");
			if(conditiontype!="None"){
				var Condition:XMLNode = new XMLNode(1, ElementParser.xpdl+"Condition");
				if (conditiontype != null) {
					if (conditiontype == "Expression") {
						conditiontype = "CONDITION";
					}
					Condition.attributes.Type = conditiontype;
					parsedNode.appendChild(Condition);
				}
				var conditionNode = getToParseSubNode("conditionexpression");
				if (conditionNode) {
					var values:XMLNode = getValues(conditionNode);
					if(values){
						if (values.firstChild && values.firstChild.firstChild) {
							var Expression:XMLNode = new XMLNode(1, ElementParser.xpdl + "Expression");
							if(values.firstChild.firstChild.nodeValue!=""){
								Expression.appendChild(values.firstChild.firstChild.cloneNode(true));
								Condition.appendChild(Expression);
							}
							//Condition.attributes.Expression = values.firstChild.firstChild;
						}
					}
				}
				var conditiondocumentation = getToParseSubNode("conditiondocumentation");
				if (conditiondocumentation) {
					var docvalues:XMLNode = getValues(conditiondocumentation);
					if(docvalues){
						if (docvalues.firstChild) {
							if (!View.getInstance().offline){
								parsedNode.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
							}
							parsedNode.attributes[ElementParser.apia+"ConditionDoc"] = docvalues.firstChild.attributes.value;
						}
					}
				}
				if (Condition.childNodes.length == 0 && conditiontype == "CONDITION") {
					Condition.removeNode();
				}
			}
		}
		
		function getVertexes() {
			var vertexes:XMLNode = getToParseSubNode("vertex");
			var ConnectorGraphicsInfos:XMLNode = new XMLNode(1, ElementParser.xpdl+"ConnectorGraphicsInfos");
			var ConnectorGraphicsInfo:XMLNode = new XMLNode(1, ElementParser.xpdl+"ConnectorGraphicsInfo");
			ConnectorGraphicsInfos.appendChild(ConnectorGraphicsInfo);
			for (var i:Number = 0; i < vertexes.childNodes.length; i++ ) {
				var verts:XMLNode = vertexes.childNodes[i].cloneNode(true);
				verts.nodeName = ElementParser.xpdl+"Coordinates";
				ConnectorGraphicsInfo.appendChild(verts);
			}
			parsedNode.appendChild(ConnectorGraphicsInfos);
		}

		function getType() {
			var type = getToParseSubNodeValue("apiatype");
			if (type /*&& type != "None"*/) {
				if (!View.getInstance().offline){
					parsedNode.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE
				}
				if (type=="Loopback") {
					//parsedNode.attributes[ElementParser.apia+"LoopBack"] = "true";
					parsedNode.attributes[ElementParser.apia+"Type"] = "L";
				}else if (type=="Wizard") {
					parsedNode.attributes[ElementParser.apia+"Type"] = "W";
				}else {
					parsedNode.attributes[ElementParser.apia+"Type"] = "N";
				}
			}
		}
		
		function getExecutionOrder() {
			var executionorder:XMLNode = getToParseSubNode("executionorder");
			if (executionorder && executionorder.attributes.value) {
				if (!View.getInstance().offline){
					parsedNode.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
				}
				parsedNode.attributes[ElementParser.apia+"ExecutionOrder"] = executionorder.attributes.value;

			}
		}
		
	}
	
}
