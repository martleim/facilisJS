package view.tools 
{
	import flash.events.*;
	import flash.net.*;
	import flash.xml.*;
	/**
	 * ...
	 * @author Martin Leiva
	 */
	public class AbstractToolManager  extends EventDispatcher {
		
		private var toolsModel:XMLNode;
		private var tools:Array;
		private var ready:Boolean = false;
		private var workingTool:AbstractTool;
		
		public static var TOOLS_READY:String = "toolsReady";
		
		public function AbstractToolManager(){
			super();
		}
		
		public function init(url:String):void {
			var loader:URLLoader = new URLLoader(); 
			loader.addEventListener(Event.COMPLETE, loadXML); 
			loader.load(new URLRequest(url));
		}
		
		private function loadXML(evt:Event):void {
			if (!ready) {
				ready = true;
				var xDoc:XMLDocument = new XMLDocument();
				xDoc.ignoreWhite=true;
				var xml:XML = new XML(evt.target.data);
				xDoc.parseXML(xml.toString());
				toolsModel = xDoc.firstChild;
				this.dispatchEvent(new Event(AbstractToolManager.TOOLS_READY));
				tools = new Array();
				for (var r:Number = 0; r < toolsModel.childNodes.length; r++) {
					var group:XMLNode = toolsModel.childNodes[r];
					for (var u:Number = 0; u < group.childNodes.length; u++ ) {
						if (group.childNodes[u].attributes.className != "") {
							tools.push(group.childNodes[u].cloneNode(true));
						}
					}
				}
			}
		}
		
		public function getToolModel():XMLNode {
			return toolsModel;
		}
		
		public function getTools():Array {
			return tools;
		}
		
		public function setWorkingTool(t:AbstractTool):void {
			if (workingTool != null) {
				workingTool.unselectTool();
			}
			workingTool = t;
		}
		
		public function getWorkingTool():AbstractTool{
			return workingTool;
		}
		
		public function getTool(toolNode:XMLNode):AbstractTool {
			return null;
			
		}
		
	}

}