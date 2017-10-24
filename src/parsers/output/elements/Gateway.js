/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements {
	import flash.xml.XMLNode;

	public class Gateway extends Activity{
		
		private var route:XMLNode;
		
		public function Gateway() {
			addParseFunction(getRoute);
			addParseFunction(getInstantiate);
			addParseFunction(getExclusiveType);
			addParseFunction(getMarkerVisible);
			addParseFunction(getIncomingCondition);
			addParseFunction(getOutgoingCondition);
			addParseFunction(getExecutionType);
			super();
		}
		
		function getRoute() {
			route = new XMLNode(1, (ElementParser.offline + "Route"));
			parsedNode.appendChild(route);
			var gatewaytype = getToParseSubNodeValue("gatewaytype");
			if (gatewaytype) {
				route.attributes.GatewayType = gatewaytype;
			}
		}
		
		function getInstantiate() {
			var instantiate = getToParseSubNodeValue("instantiate");
			if (instantiate) {
				route.attributes.Instantiate = instantiate;
			}
		}
		
		function getExclusiveType() {
			var exclusivetype = getToParseSubNodeValue("exclusivetype");
			if (exclusivetype) {
				route.attributes.ExclusiveType = exclusivetype;
			}
		}
		
		function getMarkerVisible() {
			var markervisible = getToParseSubNodeValue("markervisible");
			if (markervisible) {
				route.attributes.MarkerVisible = markervisible;
			}
		}
		
		function getIncomingCondition() {
			var conditionNode = getToParseSubNode("incomingcondition");
			if (conditionNode) {
				var values:XMLNode = getValues(conditionNode);
				if(values){
					if (values.firstChild && values.firstChild.firstChild) {
						route.attributes.IncomingCondition = values.firstChild.firstChild;
					}
				}
			}
		}
		
		function getOutgoingCondition() {
			var conditionNode = getToParseSubNode("outgoingcondition");
			if (conditionNode) {
				var values:XMLNode = getValues(conditionNode);
				if(values){
					if (values.firstChild && values.firstChild.firstChild) {
						route.attributes.OutgoingCondition = values.firstChild.firstChild;
					}
				}
			}
		}
		
		function getExecutionType() {
			var executiontype = getToParseSubNode("executiontype");
			if (executiontype) {
				//route.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
				route.attributes[ElementParser.apia+"ExecutionType"] = executiontype.attributes.value;
			}
		}
		
		
	}
	
}
