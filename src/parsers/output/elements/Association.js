/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements {
	import flash.xml.XMLNode;

	public class Association extends ElementParser{
		
		public function Association() {
			super();
			addParseFunction(getStartEnd);
			addParseFunction(getVertexes);
			addParseFunction(getDirection);
		}
		
		override function startParse():XMLNode{
			parsedNode = new XMLNode(1, ElementParser.xpdl+"Association");
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
		
		function getDirection() {
			var direction = getToParseSubNodeValue("direction");
			if (direction && direction != "") {
				parsedNode.attributes.AssociationDirection = direction;
			}
		}
		
	}
	
}
