/**
* ...
* @author Default
* @version 0.1
*/

package view.tools{

	import flash.display.MovieClip;
	import flash.events.*;
	import flash.geom.Point;
	import flash.xml.XMLNode;
	import view.*;
	import view.elements.*;
	import validation.*;
	public class DragNDropIn extends Tool {
		
		private var clone:Tool;
		private var container:String;
		
		private var droppedInElement:DropInElement;
		private var dropped:Element;
		
		public function DragNDropIn() { 
			super();
			this.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
			//this.addEventListener(MouseEvent.MOUSE_UP,onMouseUp);
			View.getInstance().addEventListener(AbstractElement.ELEMENT_DROPIN, onDropIn);
			//View.getInstance().addEventListener(AbstractElement.ELEMENT_DROP,onViewDrop);
		}
		
		private function onMouseDown(e:MouseEvent):void {
			ToolManager.getInstance().setWorkingTool(this);
			stage.addEventListener(Event.MOUSE_LEAVE, mouseLeft);
			stage.addEventListener(MouseEvent.MOUSE_MOVE, onDrag);
			//stage.addEventListener(MouseEvent.MOUSE_UP, onDrop);
			if (clone == null) {
				var targetClass:Class = Object(this).constructor;
				clone= new targetClass();
				stage.addChild(clone);
				var icon = new (Object(this.getIcon()).constructor)();
				clone.addIcon(icon);
			}
			clone.x = e.stageX-(clone.width*(1/2));
			clone.y = e.stageY - (clone.height * (1 / 2));
			clone.addEventListener(MouseEvent.MOUSE_UP, onDrop);
			clone.addEventListener(MouseEvent.MOUSE_DOWN, onDrop);
		}
		
		private function onDrag(e:MouseEvent):void {
			/*if (clone == null) {
				var targetClass:Class = Object(this).constructor;
				clone= new targetClass();
				stage.addChild(clone);
				var icon = new (this.getIcon().constructor)();
				clone.addIcon(icon);
			}*/
			clone.x = e.stageX-(clone.width*(1/2));
			clone.y = e.stageY - (clone.height * (1 / 2));
			//clone.addEventListener(MouseEvent.MOUSE_UP, onDrop);
		}
		private function onDrop(e:MouseEvent):void {
			this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, onDrag);
			this.stage.removeEventListener(Event.MOUSE_LEAVE, mouseLeft);
			if (clone != null) {
				var pt:Point = new Point(clone.x, clone.y);
				clone.parent.removeChild(clone);
				clone = null;
				this.stage.removeEventListener(MouseEvent.MOUSE_UP, onDrop);
				dropped= new Element(className);
				dropped.elementType = type;
				if(container){
					View.getInstance().getLaneView().addElement(dropped);
				}else{
					View.getInstance().getElementView().addElement(dropped);
				}
				//var pt:Point = new Point(e.stageX, e.stageY);
				pt = stage.localToGlobal(pt);
				pt = dropped.parent.globalToLocal(pt);
				dropped.x = pt.x;
				dropped.y = pt.y;
				if(View.getInstance().checkDropIns(dropped)){
					dropped.dispatchEvent(new Event(AbstractElement.ELEMENT_DROP));
				}else {
					dropped.remove();
				}
			}
		}
		private function mouseLeft(e:Event) {
			stage.removeEventListener(MouseEvent.MOUSE_MOVE, onDrag);
			stage.removeEventListener(Event.MOUSE_LEAVE, mouseLeft);
			clone.removeEventListener(MouseEvent.MOUSE_UP, onDrop);
			clone.parent.removeChild(clone);
			clone = null;
		}
		private function onViewDrop(e:MouseEvent):void {
			if (dropped) {
				dropped.remove();
				dropped = null;
			}
		}
		public function setClassName(cls:String):void{
			className = cls;
		}
		override public function setAttributes(node:XMLNode):void{
			className = node.attributes.elementClass;
			container = node.attributes.container;
			type = node.attributes.name;
		}
		private function onDropIn(e:Event) {
			if (dropped && e.target) {
				if (RuleManager.getInstance().checkDropInRule([(e.target as AbstractView).dispatcher, dropped])) {
					if (((e.target as AbstractView).dispatcher as AbstractElement)) {
						(((e.target as AbstractView).dispatcher as AbstractElement).getElement() as DropInElement).addInnerElement(dropped);
					}
				}else {
					dropped.remove();
				}
			}
			dropped = null;
		}
	}
}