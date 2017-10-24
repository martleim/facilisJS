/**
* ...
* @author Default
* @version 0.1
*/

package  view.tools{
	import flash.display.MovieClip;
	import flash.events.*;
	import flash.filters.GlowFilter;
	import flash.geom.Point;
	import flash.xml.XMLNode;
	import view.elements.*;
	import view.*;
	import view.elements.line.LineObject;
	import validation.RuleManager;
	import utils.LibraryManager;
	import view.elements.activities.ActivityElement;
	public class Connector extends Tool{
		
		private var startElement:MovieClip;
		private var lineType:String;

		private var tempLine:MovieClip;
		//private var tempLine:LineObject;
		private var dummy:MovieClip;
		
		private var dropIcon:MovieClip;
		
		private var direction:String;
		
		public function Connector() { 
			super();
			this.addEventListener(MouseEvent.CLICK, onClick);
			//this.addEventListener(MouseEvent.MOUSE_UP,onMouseUp);
		}
		
		private function onClick(e:MouseEvent) {
			e.stopPropagation();
			if (selected) {
				unselectTool();
				ToolManager.getInstance().setWorkingTool(null);
			}else{
				ToolManager.getInstance().setWorkingTool(this);
				View.getInstance().getElementView().addEventListener(AbstractElement.ELEMENT_CLICKED, onElementClicked);
				View.getInstance().getLaneView().addEventListener(AbstractElement.ELEMENT_CLICKED, onElementClicked);
				View.getInstance().getLineView().addEventListener(AbstractElement.ELEMENT_CLICKED, onLineClicked);
				View.getInstance().addEventListener(View.ON_DELETE, cancelLine);
				View.getInstance().addEventListener(View.ON_CLEAR, stopTool);
				this.parent.parent.parent.addEventListener(MouseEvent.CLICK, unselectMe );
				this.filters = [new GlowFilter(0x55FF44, 1, 15, 15, 15, 3, false, false)];
				selected = true;
			}
		}
		
		private function unselectMe(e:MouseEvent) {
			if (selected) {
				unselectTool();
				ToolManager.getInstance().setWorkingTool(null);
			}
		}
		private function stopTool(e:Event) {
			if (selected) {
				unselectTool();
				ToolManager.getInstance().setWorkingTool(null);
			}
		}
		
		private function onElementClicked(e:Event) {
			if (startElement == null) {
				if (e.target.dispatcher.y<-20) {
					return;
				}
				startElement = e.target.dispatcher;
				dummy = new MovieClip();
				dummy.graphics.beginFill(0x000000, 0)
				dummy.graphics.drawCircle(0, 0, 10);
				dummy.graphics.endFill();
				dummy.startDrag(true);
				dummy.x = startElement.x;
				dummy.y = startElement.y;
				
				View.getInstance().getBack().addChild(dummy);
				//tempLine = new LineObject(startElement, dummy);
				tempLine = new MovieClip();
				View.getInstance().getBack().addChild(tempLine);
				tempLine.alpha=.5;
				
				//View.getInstance()._stage.addEventListener(MouseEvent.MOUSE_MOVE, updateDummy);
				dummy.stage.addEventListener(MouseEvent.MOUSE_MOVE, updateDummy);
				dummy.stage.addEventListener(MouseEvent.MOUSE_DOWN, cancelLine);
				//View.getInstance().addEventListener(View.ON_UNSELECT_ALL, cancelLine);
				dummy.addEventListener(MouseEvent.MOUSE_DOWN, cancelLine);
				View.getInstance().addEventListener(AbstractElement.ELEMENT_OVER, onElementOver);
				View.getInstance().addEventListener(AbstractElement.ELEMENT_OUT, onElementOut);
			}else {
				var endElement = e.target.dispatcher;
				if (RuleManager.getInstance().getConnectionRules().validate([startElement,endElement,type]) ) {
					//var line:LineObject = View.getInstance().getLineView().addLine(startElement, endElement);
					var line:LineObject = View.getInstance().getLineView().getLine(startElement, endElement);
					if (line) {
						line.setType(lineType);
						line.elementType = type;
						View.getInstance().getLineView().addALine(line);
						if ((startElement as AbstractElement).elementType == "startevent" && ((endElement as AbstractElement).elementType == "task"||(endElement as AbstractElement).elementType == "csubflow" )) {
							(endElement as AbstractElement).getElement().setFirstTask("true");
							//line.addEventListener(AbstractElement.ELEMENT_DELETE, removeFirstTask);
							(startElement as AbstractElement).getElement().setFirstTaskType("");
						}
						line.setDirection(direction);
						line.callStartEndFunctions();
						if (type=="mflow") {
							line.setCircle();
						}
						
						if ((startElement as AbstractElement).elementType == "task" || (startElement as AbstractElement).elementType == "csubflow") {
							var type = "Task";
							if ((startElement as AbstractElement).elementType == "csubflow") {
								type = "Sub-flow";
							}
							((startElement as AbstractElement).getElement() as ActivityElement).setDependencyProps(type);
						}
						View.getInstance().refreshElementAttributes();
					}
				}
				cancelLine(e);
				this.dispatchEvent(new Event(AbstractTool.TOOL_USED));
				startElement = null;
				//unselectTool();
			}
		}
		
		/*private function removeFirstTask(e:Event) {
		}*/
		
		private function cancelLine(e:Event) {
			//View.getInstance()._stage.removeEventListener(MouseEvent.MOUSE_MOVE, updateDummy);
			if(dummy){
				dummy.stage.removeEventListener(MouseEvent.MOUSE_MOVE, updateDummy);
				dummy.stage.removeEventListener(MouseEvent.MOUSE_DOWN, cancelLine);
				//View.getInstance().removeEventListener(View.ON_UNSELECT_ALL, cancelLine);
				dummy.removeEventListener(MouseEvent.MOUSE_DOWN, cancelLine);
				dummy.parent.removeChild(dummy);
				dummy = null;
			}
			View.getInstance().removeEventListener(AbstractElement.ELEMENT_OVER, onElementOver);
			View.getInstance().removeEventListener(AbstractElement.ELEMENT_OUT, onElementOut);
			if(tempLine){
				tempLine.parent.removeChild(tempLine);
				tempLine = null;
			}
			startElement = null;
			removeDropIcon();
			this.dispatchEvent(new Event(AbstractTool.TOOL_USED));
		}
		
		private function onLineClicked(e:Event) {
			if(startElement==null){
				//startElement = ((e.target.dispatcher as LineObject).middle as MovieClip);
			}else {
				var endElement = ((e.target.dispatcher as LineObject).middle as MovieClip);
				if (RuleManager.getInstance().getConnectionRules().validate([startElement,endElement,type]) ) {
					var line:LineObject = View.getInstance().getLineView().addLine(startElement, endElement);
					if(line){
						line.setType(lineType);
						line.elementType = type;
						if (type=="mflow") {
							line.setCircle();
						}
						line.setDirection(direction);
						line.callStartEndFunctions();
					}
				}
				startElement = null;
				cancelLine(e);
			}
		}
		
		
		override public function unselectTool():void {
			selected = false;
			//ToolManager.getInstance().setWorkingTool(null);
			this.filters = [];
			
			View.getInstance().getElementView().removeEventListener(AbstractElement.ELEMENT_CLICKED, onElementClicked);
			View.getInstance().getLaneView().removeEventListener(AbstractElement.ELEMENT_CLICKED, onElementClicked);
			View.getInstance().getLineView().removeEventListener(AbstractElement.ELEMENT_CLICKED, onLineClicked);
			View.getInstance().removeEventListener(View.ON_DELETE, cancelLine);
			View.getInstance().removeEventListener(View.ON_CLEAR, stopTool);
			this.parent.parent.parent.removeEventListener(MouseEvent.CLICK, unselectMe );
		}
		
		public function setLineType(s:String) {
			lineType = s;
		}
		
		override public function setAttributes(node:XMLNode):void{
			lineType = node.attributes.lineType;
			type = node.attributes.name;
			direction = node.attributes.direction;
		}
		
		private function updateDummy(e:MouseEvent) {
			var pt:Point = new Point(e.stageX, e.stageY);
			pt=stage.localToGlobal(pt);
			pt=tempLine.parent.globalToLocal(pt);
			dummy.x = e.stageX
			dummy.y = e.stageY;
			tempLine.graphics.clear();
			tempLine.graphics.lineStyle(2, 0x000000, 0.3);
			var startP = new Point(startElement.x, startElement.y);
			startP = startElement.parent.localToGlobal(startP);
			//startP = View.getInstance()._stage.globalToLocal(startP);
			startP=tempLine.parent.globalToLocal(startP);
			tempLine.graphics.moveTo(startP.x, startP.y);
			tempLine.graphics.lineTo(pt.x, pt.y);
			if (dropIcon) {
				dropIcon.x = dummy.x-dropIcon.width;
				dropIcon.y = dummy.y-dropIcon.height;
			}
			this.dispatchEvent(new Event(AbstractTool.TOOL_WORKING));
		}
		
		private function onElementOver(e:Event) { 
			var el:AbstractElement = (e.target as View).dispatcher;
			removeDropIcon();
			if (startElement) {
				el.filters = [new GlowFilter(0xFF0000, 1, 10, 10)];
				startElement.filters = [new GlowFilter(0x00FF00, 1, 10, 10)];
				if (RuleManager.getInstance().getConnectionRules().validate([startElement, el, type])) {
					dropIcon = LibraryManager.getInstance().getInstancedObject("icons.drop.Permited") as MovieClip;
					dummy.stage.addChild(dropIcon);
					dropIcon.x = dummy.x;
					dropIcon.y = dummy.y;
				}else {
					dropIcon = LibraryManager.getInstance().getInstancedObject("icons.drop.Forbidden") as MovieClip;
					dummy.stage.addChild(dropIcon);
					dropIcon.x = dummy.x;
					dropIcon.y = dummy.y;
				}
			}
		}
		
		private function removeDropIcon() {
			if(dropIcon && dropIcon.parent){
				dropIcon.parent.removeChild(dropIcon);
				dropIcon = null;
			}
		}
		
		private function onElementOut(e:Event) {
			removeDropIcon();
			var el:AbstractElement = (e.target as AbstractView).dispatcher;
			el.filters = [];
			startElement.filters = [];
		}
		
	}
}