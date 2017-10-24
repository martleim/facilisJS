/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements {
	import flash.xml.XMLNode;
	import parsers.output.ParseOutUtils;

	public class DataObject extends Artifact{
		
		public function DataObject() {
			super();
			addParseFunction(getDataObject);
		}
		
		function getDataObject() {
			var node:XMLNode = new XMLNode(1, ElementParser.xpdl+"DataObject");
			var id = toParseNode.attributes.id;
			node.attributes.Id = id;
			var name = getToParseSubNodeValue("name");
			if (name != null) {
				node.attributes.Name = name;
			}
			var state = getToParseSubNodeValue("state");
			if (state != null) {
				node.attributes.State = state;
			}
			var isCollection = getToParseSubNodeValue("isCollection");
			if (isCollection != null) {
				node.attributes.IsCollection = isCollection;
			}
		}
		
		
		function getLoopType() {
			var loopType = getToParseSubNodeValue("looptype");
			if (loopType) {
				var strNode = "<Loop LoopType=\""+loopType+"\">";
				if (loopType == "Standard") {
					var testTime = getToParseSubNodeValue("testtime");
					var loopmaximum = getToParseSubNodeValue("loopmaximum");
					strNode += "<LoopStandard " +
					((testTime)?("TestTime=\""+testTime+"\"" ):"")+
					((loopmaximum)?("LoopMaximum=\""+loopmaximum+"\" "):"")+
					" />";
				}else if (loopType == "MultiInstance") {
					var ordering = getToParseSubNodeValue("mi_ordering");
					strNode += "<LoopStandard TestTime=\""+ordering+"\" />";
				}
				strNode += "</Loop>";
				var loopNode:XMLNode = getParsedNode(strNode);
				parsedNode.appendChild(loopNode);
			}
		}
	}
	
}
