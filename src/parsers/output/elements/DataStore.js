/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements {
	import flash.xml.XMLNode;
	import parsers.output.ParseOutUtils;
	import parsers.output.elements.ElementParser;
	
	public class DataStore extends ElementParser{
		
		public function DataStore() {
			super();
			addParseFunction(getDataStore);
			addParseFunction(getNodeGraphicsInfo);
		}
		
		override function startParse():XMLNode{
			parsedNode = new XMLNode(1, (ElementParser.xpdl + "DataStore"));
			this.callParseFunctions();
			return parsedNode;
		}
		
		function getDataStore() {
			//var node:XMLNode = new XMLNode(1, ElementParser.xpdl + "DataStore");
			var id = toParseNode.attributes.id;
			//node.attributes.Id = id;
			parsedNode.attributes.Id = id;
			var name = getToParseSubNodeValue("name");
			if (name != null) {
				//node.attributes.Name = name;
				parsedNode.attributes.Name = name;
			}
			/*
			var state = getToParseSubNodeValue("state");
			if (state != null) {
				node.attributes.State = state;
			}
			*/
			//node.attributes.IsUnlimited = "true";
			var isUnlimited = getToParseSubNodeValue("isUnlimited");
			if(isUnlimited)
				parsedNode.attributes.IsUnlimited = isUnlimited;
				
			var capacity = getToParseSubNodeValue("capacity");
			if(capacity)
				parsedNode.attributes.Capacity = capacity;
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
			//getColor(NodeGraphicsInfo);
		}
	}
}
