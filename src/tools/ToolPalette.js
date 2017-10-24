package view.tools {
	import caurina.transitions.Tweener;
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.events.TimerEvent;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.utils.Timer;
	import flash.xml.XMLNode;
	import validation.RuleManager;
	import view.elements.AbstractElement;
	import view.elements.activities.ActivityElement;
	import view.elements.Element;
	import view.elements.line.LineObject;
	import view.focus.FocusManager;
	import view.tools.Tool;
	import view.View;
	
	/**
	 * ...
	 * @author Martin Leiva
	 */
	public class ToolPalette extends Sprite {
		
		private static var allowInstantiation:Boolean=false;
		private static var _instance:ToolPalette;
		
		private var tools:Array;
		private var toolsCont:Sprite;
		private var toolHeight:Number = 25;
		private var paleteElement:AbstractElement;
		private var openPaleteElement:AbstractElement;
		
		private var timeToDisplay:Number = 2000;
		private var timer:Timer;
		
		private var isShown:Boolean = false;
		private var toolWorking:Boolean = false;
		
		private var _startAngle = 140;
		private var _totalAngle = 130;
		private var _minRadius = 50;
		
		private var paleteContainer:DisplayObject;
		
		private var disabled:Boolean = false;
		
		public function ToolPalette() {
			super();
			if (!allowInstantiation) {
				throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
			}else {
				timer = new Timer(timeToDisplay, 1);
				timer.addEventListener(TimerEvent.TIMER,onTimer);
				tools = new Array();
				toolsCont = new Sprite();
				//View.getInstance().mainStage.addChild(this);
				
				this.addEventListener(MouseEvent.ROLL_OUT, onPaletteOut);
				View.getInstance()._stage.addEventListener(MouseEvent.MOUSE_UP, hidePaletteEvent);
				//View.getInstance()._stage.stage.addEventListener(MouseEvent.MOUSE_DOWN, hidePaletteEvent);
				View.getInstance().addEventListener(AbstractElement.ELEMENT_MOVED, hidePaletteEvent);
				View.getInstance().addEventListener(AbstractElement.ELEMENT_DELETED, hidePaletteEvent);
				View.getInstance().addEventListener(View.ON_CLEAR, hidePaletteEvent);
				//View.getInstance().addEventListener(View.ON_UNSELECT_ALL, hidePaletteEvent);
				//View.getInstance().addEventListener(View.ON_DELETE, hidePaletteDeleteEvent);
				View.getInstance().addEventListener(View.ON_ZOOM, hidePaletteEvent);
				FocusManager.getInstance().addEventListener(FocusManager.ON_FOCUS, hidePaletteEvent);
				
				ToolManager.getInstance().addEventListener(AbstractTool.TOOL_USED, onOtherToolUsed);
				ToolManager.getInstance().addEventListener(AbstractTool.TOOL_WORKING, onOtherToolWorking);
				
			}
		}
		
		private function onOtherToolUsed(e:Event) {
			toolWorking = false;
		}
		
		private function onOtherToolWorking(e:Event) {
			toolWorking = true;
		}
		
		public function init(cont) {
			paleteContainer = cont;
			paleteContainer.addChild(this);
			this.addChild(toolsCont);
		}
		
		public static function getInstance():ToolPalette {
			if (_instance == null) {
				allowInstantiation = true;
				_instance = new ToolPalette();
				allowInstantiation = false;
			}
			return _instance;
		}
		
		public function showPalette(el:AbstractElement, now:Boolean = false) {
			if (doShow()) {
				if (paleteElement != el || !isShown) {
					isShown = false;
					hidePalette();
					paleteElement = el;
					if(now)
						drawPalette();
					else
						timer.start();
				}
			}
		}
		
		private function doShow():Boolean {
			if (!toolWorking && 
			(!ToolManager.getInstance().getWorkingTool() || 
			(ToolManager.getInstance().getWorkingTool() && ToolManager.getInstance().getWorkingTool().toString().indexOf("Connector")<0))
			) {
				return true;
			}
		}
		
		private function onPaletteOut(e:MouseEvent) {
			
		}
		
		private function hidePaletteEvent(e:Event) {
			if(!toolWorking){
				isShown = false;
				this.hidePalette();
			}
		}
		
		private function hidePaletteDeleteEvent(e:Event) {
			isShown = false;
			this.hidePalette();
			toolsCont.graphics.clear();
			paleteElement = null;
			openPaleteElement = null;
			clearTools();
		}
		
		public function hidePalette() {
			timer.stop();
			if (!isShown || 
			isShown && !this.hitTestPoint(this.mouseX, this.mouseY, true)) {
				undrawPalette();
			}
		}
		
		private function isValid(el:AbstractElement, tool:XMLNode):Boolean {
			try{
			var toolName = tool.attributes.name;
			var className = tool.attributes.className;
			var possible:Array = (RuleManager.getInstance().getConnectionRules() as Object).getPossible(el);
			var toEl:Element = new Element(className);
			toEl.elementType = toolName;
			return RuleManager.getInstance().getConnectionRules().validate([el, toEl, "sflow"])
			}catch (e) { }
			return false;
			/*for (var i:Number = 0; i < possible.length; i++ ) {
				if (possible[i].to==toolName && possible[i].valid.indexOf("sflow")>=0) {
					return true;
				}
			}*/
			//return false;
		}
		
		private function onTimer(e:TimerEvent) {
			drawPalette();
		}
		
		private function clearTools() {
			while (toolsCont.numChildren>0) {
				toolsCont.removeChildAt(0);
			}
		}
		
		public function drawPalette() {
			var tools:Array = ToolManager.getInstance().getTools();
			var toolsToAdd:Array = new Array();
			for (var i:Number = 0; i < tools.length; i++ ) {
				var toolNode:XMLNode = tools[i];
				if (toolNode.attributes.name && isValid(paleteElement, toolNode)) {
					var t:Tool = ToolManager.getInstance().getTool(toolNode);
					toolsToAdd.push(t);
					t.addEventListener(AbstractTool.TOOL_USED, onToolUsed);
					t.addEventListener(AbstractTool.TOOL_WORKING, onToolWorking);
				}
			}
			if (toolsToAdd.length == 0) {
				return;
			}
			i = 0;
			this.clearTools();
			for (i = 0; i < toolsToAdd.length; i++ ) {
				var toolEl:Tool = toolsToAdd[i];
				var ratio = toolHeight / toolEl.height;
				toolEl.scaleX=ratio;
				toolEl.scaleY = ratio;
				toolsCont.addChild(toolEl);
			}
			
			//var h:Number = toolsCont.numChildren * toolHeight;
			var angle = _totalAngle / toolsCont.numChildren;
			//radius = paleteElement.x + (paleteElement.width / 2);
			openPaleteElement = paleteElement;
			var endRadius:Point = new Point(((paleteElement.width / 2) + 30 +paleteElement.x ), paleteElement.y);
			endRadius = paleteElement.parent.localToGlobal(endRadius);
			endRadius = toolsCont.parent.localToGlobal(endRadius);
			
			var palettePoint:Point = new Point(paleteElement.x, paleteElement.y);
			palettePoint = paleteElement.parent.localToGlobal(palettePoint);
			palettePoint = toolsCont.parent.localToGlobal(palettePoint);
			
			var radius = Math.abs(palettePoint.x - endRadius.x);
			radius = (radius > _minRadius)?radius:_minRadius;
			var start = getStartAngle(radius);
			toolsCont.graphics.clear();
			toolsCont.graphics.lineStyle(1, 0,0);
			toolsCont.graphics.beginFill(0x000000, 0);
			
			toolsCont.graphics.moveTo(palettePoint.x, palettePoint.y);
			
			var xTool = ((Math.sin((start +10) * (Math.PI / 180)) * radius) + palettePoint.x);
			var yTool = ((Math.cos((start +10) * (Math.PI / 180)) * radius) + palettePoint.y);
			toolsCont.graphics.lineTo(xTool, yTool);
			
			for (var i:Number = 0; i < toolsCont.numChildren; i++ ) {
				var tool = toolsCont.getChildAt(i);
				
				xTool = ((Math.sin((start - (angle * i)) * (Math.PI / 180)) * radius) + palettePoint.x);
				var xEnd = xTool - (tool.width / 2);
				yTool = ((Math.cos((start - (angle * i)) * (Math.PI / 180)) * radius) + palettePoint.y);
				var yEnd = yTool - (tool.height / 2);
				
				tool.x = palettePoint.x;
				tool.y = palettePoint.y;
				tool.alpha = 0;
				/*if (i == toolsCont.numChildren - 1) {
					toolsCont.graphics.lineTo(xTool+(paleteElement.width/2), yTool+(paleteElement.height/2));
				}else if (i == 0) {
					toolsCont.graphics.lineTo(xTool-(paleteElement.width/2), yTool-(paleteElement.height/2));
				}else {*/
					toolsCont.graphics.lineTo(xTool, yTool);
				//}
				Tweener.addTween(tool, { x:xEnd, time:.5, transition:"easeInQuart" } );
				Tweener.addTween(tool, { y:yEnd, time:.5, transition:"easeInQuart" } );
				Tweener.addTween(tool, { alpha:1, time:.5, transition:"easeInQuart" } );
			}
			var xTool = ((Math.sin((start -((angle*(toolsCont.numChildren-1))+10)) * (Math.PI / 180)) * radius) + palettePoint.x);
			var yTool = ((Math.cos((start -((angle*(toolsCont.numChildren-1))+10)) * (Math.PI / 180)) * radius) + palettePoint.y);
			toolsCont.graphics.lineTo(xTool, yTool);
			
			toolsCont.graphics.lineTo(palettePoint.x, palettePoint.y);
			toolsCont.graphics.endFill();
			isShown = true;
		}
		
		private function getStartAngle(radius) {
			var start = _startAngle;
			var angleCount = 0;
			while (!testAngle(radius,start)) {
				start -= 45;
				angleCount++;
			}
			if (testAngle(radius,start-45) && (angleCount%2)!=0) {
				start -= 45;
			}
			return start;
		}
		private function testAngle(radius,start) {
			var palettePoint:Point = new Point(paleteElement.x, paleteElement.y);
			palettePoint = paleteElement.parent.localToGlobal(palettePoint);
			palettePoint = toolsCont.parent.localToGlobal(palettePoint);
			var r:Rectangle = new Rectangle(0, 0, this.stage.stageWidth, this.stage.stageHeight);
			var p1:Point = new Point(((Math.sin(start * (Math.PI / 180)) * radius) + palettePoint.x), (((Math.cos(start * (Math.PI / 180)) * radius) + palettePoint.y)));
			var p2:Point = new Point(((Math.sin((start - _totalAngle) * (Math.PI / 180)) * radius) + palettePoint.x), (((Math.cos(start - _totalAngle)) * (Math.PI / 180)) * radius) + palettePoint.y);
			if (r.containsPoint(p1) && r.containsPoint(p2)) {
				return true;
			}
			return false;
		}
		
		public function undrawPalette() {
			if(!toolWorking){
				toolsCont.graphics.clear();
				if(openPaleteElement && paleteElement && paleteElement.parent){
					var palettePoint:Point = new Point(openPaleteElement.x, openPaleteElement.y);
					palettePoint=paleteElement.parent.localToGlobal(palettePoint);
					palettePoint = toolsCont.parent.localToGlobal(palettePoint);
					paleteElement = null;
					openPaleteElement = null;
					for (var i:Number = 0; i < toolsCont.numChildren; i++ ) {
						var tool:Tool = toolsCont.getChildAt(i) as Tool;
						tool.disabled = true;
						tool.removeEventListener(AbstractTool.TOOL_USED, onToolUsed);
						tool.removeEventListener(AbstractTool.TOOL_WORKING, onToolWorking);
						Tweener.addTween(tool, { x:palettePoint.x, time:.5, transition:"easeOutQuart" } );
						Tweener.addTween(tool, { y:palettePoint.y, time:.5, transition:"easeOutQuart" } );
						Tweener.addTween(tool, { alpha:0, time:.5, transition:"easeOutQuart", onComplete:clearTools } );
					}
				}else {
					clearTools();
				}
				isShown = false;
			}
		}
		
		private function onToolUsed(e:Event) {
			toolWorking = false;
			var added:AbstractElement = (e.currentTarget as Tool).element;
			
			//added.dispatchEvent(new Event(AbstractElement.ELEMENT_DROP));
			if(added){
				var startElement:Element = openPaleteElement;
				var endElement:Element = added;
				//var line:LineObject = View.getInstance().getLineView().addLine(startElement, endElement);
				var line:LineObject = View.getInstance().getLineView().getLine(startElement, endElement);
				if (line) {
					line.elementType = "sflow";
					View.getInstance().getLineView().addALine(line);
					//line.setType(lineType);
					//line.elementType = type;
					if ((startElement as AbstractElement).elementType == "startevent" && ((endElement as AbstractElement).elementType == "task"||(endElement as AbstractElement).elementType == "csubflow" )) {
						(endElement as AbstractElement).getElement().setFirstTask("true");
						//line.addEventListener(AbstractElement.ELEMENT_DELETE, removeFirstTask);
						(startElement as AbstractElement).getElement().setFirstTaskType("");
					}
					//line.setDirection(direction);
					line.callStartEndFunctions();
					/*if (type=="mflow") {
						line.setCircle();
					}*/
					
					if ((startElement as AbstractElement).elementType == "task" || (startElement as AbstractElement).elementType == "csubflow") {
						var type = "Task";
						if ((startElement as AbstractElement).elementType == "csubflow") {
							type = "Sub-flow";
						}
						((startElement as AbstractElement).getElement() as ActivityElement).setDependencyProps(type);
					}
					View.getInstance().refreshElementAttributes();
					if ((endElement as AbstractElement).elementType == "middleevent") {
						endElement.setContainer(null);
						if (endElement.getData()) {
							var d:XMLNode = endElement.getData().firstChild;
							for (var i:Number = 0; i < d.childNodes.length; i++ ) {
								if (d.childNodes[i].attributes.name == "attached") {
									d.childNodes[i].attributes.value = "FALSE";
								}
								if (d.childNodes[i].attributes.name == "eventdetailtype") {
									d.childNodes[i].attributes.value = "None";
								}
							}
						}
						//(endElement.getElement() as Object).setTypeDisabled("None", "FALSE");
						(endElement.getElement() as Object).typeChange("None");
					}
				}
			}
		}
		
		private function onToolWorking(e:Event) {
			View.getInstance().unselectAll();
			toolWorking = true;
		}
	}
}