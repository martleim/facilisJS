/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements {
	import flash.xml.XMLNode;
	import view.View;

	public class Lane extends Activity{
		
		public function Lane(){
			super();
		}
		
		override function startParse():XMLNode{
			parsedNode = new XMLNode(1, ElementParser.xpdl + "Lane");
			if(!View.getInstance().offline){
				parsedNode.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
			}
			this.callParseFunctions();
			return parsedNode;
		}
		
	}
	
}
