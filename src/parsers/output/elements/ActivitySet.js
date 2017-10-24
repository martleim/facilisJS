/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements {
	import flash.xml.XMLNode;
	import parsers.output.ParserOut;
	import parsers.Parser;

	public class ActivitySet extends ElementParser{
		
		public function ActivitySet() {
			super();
			removeParseFunction(getObjectNode);
		}
		
		override function startParse():XMLNode{
			parsedNode = new XMLNode(1, (ElementParser.offline + "ActivitySet"));
			this.callParseFunctions();
			return parsedNode;
		}
		
		
		function getSubElements() {
			var subElements:XMLNode = getToParseSubNode("subElements");
			var p:ParserOut = new ParserOut();
			p.parseProcessElements(subElements, parsedNode);
		}
		
	}
	
}
