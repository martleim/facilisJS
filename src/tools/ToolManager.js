package view.tools 
{
	import flash.display.MovieClip;
	import flash.events.*;
	import flash.net.*;
	import flash.xml.XMLDocument;
	import flash.xml.XMLNode;
	import utils.LibraryManager;
	import utils.Tooltip;
	/**
	 * ...
	 * @author Martin Leiva
	 */
	public class ToolManager extends AbstractToolManager{
		
		private static var allowInstantiation:Boolean=false;
		private static var _instance:ToolManager;
		
		public function ToolManager() {
			super();
			if (!allowInstantiation) {
				throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
			}
		}
		
		public static function getInstance():ToolManager {
			if (_instance == null) {
				allowInstantiation = true;
				_instance = new ToolManager();
				allowInstantiation = false;
			}
			return _instance;
		}
		
		override public function getTool(toolNode:XMLNode):AbstractTool {
			var className:String = "view.tools.NullTool";
			if (toolNode.attributes.className != "") {
				className = toolNode.attributes.className;
			}
			var tool:AbstractTool = LibraryManager.getInstance().getInstancedObject(className) as AbstractTool;
			if(toolNode.attributes.icon){
				var icon:MovieClip = LibraryManager.getInstance().getInstancedObject(toolNode.attributes.icon) as MovieClip;
				(tool as Tool).addIcon(icon);
			}
			if (toolNode.attributes.label && toolNode.attributes.label != "") {
				Tooltip.getInstance().setToolTip((tool as Tool).getTop(), toolNode.attributes.label);
			}
			tool.setAttributes(toolNode);
			
			tool.addEventListener(AbstractTool.TOOL_WORKING, dispatchEvent);
			tool.addEventListener(AbstractTool.TOOL_USED, dispatchEvent);
			
			return tool;
			
		}
		
	}

}