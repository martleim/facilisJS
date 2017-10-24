/**
* ...
* @author Default
* @version 0.1
*/

package view.tools{

	import flash.display.MovieClip;
	import flash.events.*;
	import flash.filters.GlowFilter;
	import flash.geom.Point;
	import flash.text.TextField;
	import flash.xml.XMLNode;
	import view.*;
	import view.elements.Element;
	import view.elements.AbstractElement;
	import validation.*;
	public class DragNDrop extends Tool {
		
		private var clone:Tool;
		private var container:String;
		private var moved:Boolean = false;
		
		public function DragNDrop() { 
			super();
			this.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
			//this.addEventListener(MouseEvent.MOUSE_UP,onMouseUp);
		}
		
		private function onMouseDown(e:MouseEvent):void {
			if(!_disabled && !checkPoolExists()){
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
		}
		
		private function onDrag(e:MouseEvent):void {
			/*if (clone == null) {
				var targetClass:Class = Object(this).constructor;
				clone= new targetClass();
				stage.addChild(clone);
				var icon = new (this.getIcon().constructor)();
				clone.addIcon(icon);
			}*/
			moved = true;
			clone.x = e.stageX-(clone.width*(1/2));
			clone.y = e.stageY - (clone.height * (1 / 2));
			this.dispatchEvent(new Event(AbstractTool.TOOL_WORKING));
			//clone.addEventListener(MouseEvent.MOUSE_UP, onDrop);
		}
		/*
		var a:TextField = null;
		private function log(msg:String):void {
			if(a == null) {
				a = new TextField();
				a.width = 500;
				a.x = 400;
				a.y = 10;
				stage.addChild(a);
			}
			
			a.text = msg;
		}
		*/
		private function onDrop(e:MouseEvent):void {
			stage.removeEventListener(MouseEvent.MOUSE_MOVE, onDrag);
			stage.removeEventListener(Event.MOUSE_LEAVE, mouseLeft);
			//stage.removeEventListener(MouseEvent.MOUSE_UP, onDrop);
			element = null;
			if (clone != null) {
				if (moved && View.getInstance().checkDrop(clone)) {
					var tsk1:Element = new Element(className);
					tsk1.elementType = type;
					var pt:Point = new Point(e.stageX, e.stageY);
					pt=stage.localToGlobal(pt);
					pt = View.getInstance().getElementView().globalToLocal(pt);
					//pt = tsk1.parent.globalToLocal(pt);
					tsk1.x = pt.x;
					tsk1.y = pt.y;
					if(container || type=="group" || type=="pool" ){
						View.getInstance().getLaneView().addElement(tsk1);
					}else{
						View.getInstance().getElementView().addElement(tsk1);
					}
					var drawer:ModelDrawer = new ModelDrawer();
					drawer.setValues(tsk1);
					tsk1.dispatchEvent(new Event(AbstractElement.ELEMENT_DROP));
					var number = View.getInstance().getNextElement(tsk1);
					var data:XMLNode = tsk1.getData();
					var name:String = data.attributes.name;
					/*if (name && type != "task" && type != "csubflow" && type != "startevent" && type != "middleevent" && type != "endevent") {
						name = name.toUpperCase() + "_" + number;
						var bpmn:XMLNode = data.firstChild;
						for (var i:Number = 0; i < bpmn.childNodes.length;i++ ) {
							if (bpmn.childNodes[i].attributes.name == "name" || bpmn.childNodes[i].attributes.name == "nameChooser") {
								bpmn.childNodes[i].attributes.value = name;
								try {
									(tsk1.getElement() as Object).setName(name);
								}catch (e) {
									trace("ERRRER");
								}
							}
						}
					}*/
					element = tsk1;
				}
				clone.removeEventListener(MouseEvent.MOUSE_UP, onDrop);
				clone.parent.removeChild(clone);
				clone = null;
			}
			moved = false;
			this.dispatchEvent(new Event(AbstractTool.TOOL_USED));
		}
		private function mouseLeft(e:Event) {
			stage.removeEventListener(MouseEvent.MOUSE_MOVE, onDrag);
			stage.removeEventListener(Event.MOUSE_LEAVE, mouseLeft);
			clone.removeEventListener(MouseEvent.MOUSE_UP, onDrop);
			clone.parent.removeChild(clone);
			clone = null;
		}
		public function setClassName(cls:String) {
			className = cls;
		}
		override public function setAttributes(node:XMLNode):void {
			className = node.attributes.elementClass;
			container = node.attributes.container;
			type = node.attributes.name;
			color = node.attributes.color;
		}
		
		private function checkPoolExists() {
			var elements:Array = View.getInstance().getLaneView().getElements();
			if (type != "pool") {
				return false;
			}
			for (var i:Number = 0; i < elements.length; i++ ) {
				if ((elements[i] as AbstractElement).elementType=="pool") {
					return true;
				}
			}
			return false;
		}
		
	}
	
}