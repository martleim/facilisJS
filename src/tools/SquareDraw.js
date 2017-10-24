/**
* ...
* @author Default
* @version 0.1
*/

package view.tools {
	import flash.display.MovieClip;
	import flash.display.Stage;
	import flash.filters.GlowFilter;
	import flash.geom.Point;
	import flash.xml.XMLNode;
	import view.elements.Element;
	import view.View;
	import flash.events.*;
	import view.elements.AbstractElement;

	public class SquareDraw extends Tool {
		
		private var toolFill:uint = 0x00000044;
		private var toolLine:uint = 0x00000044;
		
		private var startPoint:Point;
		private var drawing:Boolean;
		
		private var drawMC:MovieClip;
		
		private var _stage:Stage;
		
		public function SquareDraw() { 
			super();
			this.addEventListener(MouseEvent.CLICK, onClick);
		}
		
		private function onClick(e:MouseEvent) {
			e.stopPropagation();
			if (selected) {
				unselectTool();
			}else {
				selected = true;
				ToolManager.getInstance().setWorkingTool(this);
				View.getInstance()._stage.addEventListener(MouseEvent.MOUSE_DOWN, startDraw);
				this.filters = [new GlowFilter(0x55FF44, 1, 15, 15, 15, 3, false, false)];
			}
		}
		
		override public function unselectTool():void{
			selected = false;
			View.getInstance()._stage.removeEventListener(MouseEvent.MOUSE_DOWN, startDraw);
			this.filters = [];
		}
		
		private function startDraw(e:MouseEvent) {
			if(!checkPoolExists()){
				e.stopPropagation();
				View.getInstance()._stage.addEventListener(MouseEvent.MOUSE_MOVE, drawUpdate);
				this.stage.addEventListener(MouseEvent.MOUSE_UP, stopDraw);
				drawing = true;
				if (drawMC) {
					View.getInstance().getElementView().removeChild(drawMC);
					drawMC = null;
				}
				drawMC = new MovieClip();
				View.getInstance().getElementView().addChild(drawMC);
				
				startPoint = new Point(e.stageX, e.stageY);
				startPoint = View.getInstance().getLaneView().globalToLocal(startPoint);
			}
		}
		
		private function drawUpdate(e:MouseEvent) {
			e.stopPropagation();
			drawMC.graphics.clear();
			drawMC.graphics.beginFill(toolFill, 0.2);
			
			var endPoint:Point = new Point(e.stageX, e.stageY);
			endPoint = View.getInstance().getLaneView().globalToLocal(endPoint);
			
			drawMC.graphics.lineStyle(1, toolLine, 0.5);
			var sX = (startPoint.x < e.stageX)?startPoint.x:endPoint.x;
			var sY = (startPoint.y < e.stageY)?startPoint.y:endPoint.y;
			
			var eX = (startPoint.x < e.stageX)?endPoint.x:startPoint.x;
			var eY = (startPoint.y < e.stageY)?endPoint.y:startPoint.y;
			
			drawMC.graphics.drawRect(sX, sY, (eX - sX), (eY - sY));
			drawMC.graphics.endFill();
		}
		
		private function stopDraw(e:MouseEvent) {
			drawUpdate(e);
			View.getInstance()._stage.removeEventListener(MouseEvent.MOUSE_MOVE, drawUpdate);
			this.stage.removeEventListener(MouseEvent.MOUSE_UP, stopDraw);
			if (drawMC) {
				var h = drawMC.height;
				var w = drawMC.width;
				View.getInstance().getElementView().removeChild(drawMC);
				drawMC = null;
			
				drawing = false;
				if (h < 100 || w < 100) {
					return;
				}
				var tsk1:Element = new Element(className);
				tsk1.elementType = type;
				View.getInstance().getLaneView().addElement(tsk1);
				var endPoint:Point = new Point(e.stageX, e.stageY);
				//endPoint = View.getInstance().getLaneView().globalToLocal(endPoint);
				//var sPoint:Point = View.getInstance().getLaneView().localToGlobal(startPoint);
				var sX = (startPoint.x < endPoint.x)?startPoint.x:endPoint.x;
				var sY = (startPoint.y < endPoint.y)?startPoint.y:endPoint.y;
				
				var sPoint = View.getInstance()._stage.globalToLocal(View.getInstance().getLaneView().localToGlobal(new Point(sX, sY)));
				sX = sPoint.x;
				sY = sPoint.y;
				
				tsk1.x = sX + (w / 2);
				tsk1.y = sY + (h / 2);

				tsk1.setSize(w,h);
				
				tsk1.dispatchEvent(new Event(AbstractElement.ELEMENT_DROP));
				tsk1.elementType = type;
				
				var number = View.getInstance().getNextElement(tsk1);
				var data:XMLNode = tsk1.getData();
				var name:String = data.attributes.name;
				if (name) {
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
				}
			
			}
		}
		
		override public function setAttributes(node:XMLNode):void{
			className = node.attributes.elementClass;
			type = node.attributes.name;
		}
		
		private function checkAddPool() {
			var els:Array = View.getInstance().getLaneView().getElements();
			for (var i:Number = 0; i < els.length; i++ ) {
				if ((els[i] as AbstractElement).elementType=="pool") {
					return true;
				}
			}
			return false;
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
