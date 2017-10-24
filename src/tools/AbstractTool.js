package view.tools 
{
	import flash.display.MovieClip;
	import flash.xml.XMLNode;
	/**
	 * ...
	 * @author Martin Leiva
	 */
	public class AbstractTool extends MovieClip{
		
		public static var TOOL_USED:String = "toolUsed";
		public static var TOOL_WORKING:String = "toolWorking";
		
		public function AbstractTool() {
			super();
		}
		
		public function unselectTool():void {
		}
		
		public function addIcon(i:MovieClip):void {
		}
		
		public function setAttributes(node:XMLNode):void {
		}
	}

}