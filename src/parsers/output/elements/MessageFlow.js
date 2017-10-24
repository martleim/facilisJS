/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements {
	import flash.xml.XMLNode;
	import parsers.output.ParseOutUtils;

	public class MessageFlow extends ElementParser{
		

		public function MessageFlow() {
			super();
			addParseFunction(getStartEnd);
			addParseFunction(getVertexes);
			addParseFunction(getMessageRef);
		}
		
		override function startParse():XMLNode{
			parsedNode = new XMLNode(1, "MessageFlow");
			this.callParseFunctions();
			return parsedNode;
		}
		
		function getStartEnd() {
			var startid = toParseNode.attributes.startid;
			var endid = toParseNode.attributes.endid;
			parsedNode.attributes.Source = startid;
			parsedNode.attributes.Target = endid;
		}
		
		function getVertexes() {
			var vertexes:XMLNode = getToParseSubNode("vertex");
			var ConnectorGraphicsInfos:XMLNode = new XMLNode(1, "ConnectorGraphicsInfos");
			var ConnectorGraphicsInfo:XMLNode = new XMLNode(1, "ConnectorGraphicsInfo");
			ConnectorGraphicsInfos.appendChild(ConnectorGraphicsInfo);
			for (var i:Number = 0; i < vertexes.childNodes.length; i++ ) {
				ConnectorGraphicsInfo.appendChild(vertexes.childNodes[i].cloneNode(true));
			}
		}
		
		function getMessageRef() {
			var messageref:XMLNode = getToParseSubNode("messageref");
			var MessageRef:XMLNode = new XMLNode(1, "MessageRef");
			if (messageref) {
				var documentation:XMLNode = ParseOutUtils.getSubNode(messageref, "documentation");
				var categories:XMLNode = ParseOutUtils.getSubNode(messageref, "categories");
				var properties:XMLNode = ParseOutUtils.getSubNode(messageref, "properties");
				var name = ParseOutUtils.getSubNodeValue(messageref, "name");
				
				MessageRef.attributes.Name = name;
				
				if (categories) {
					var Categories:XMLNode = getCategoriesNode(categories);
					MessageRef.appendChild(Categories);
				}
				if(documentation){
					var Documentation:XMLNode = getDocumentationNode(documentation);
					MessageRef.appendChild(Documentation);
				}
				if(properties){
					var Properties:XMLNode = getPropertiesNode(properties, MessageRef);
				}
				parsedNode.appendChild(MessageRef);
			}
			
		}
		
	}
	
}
