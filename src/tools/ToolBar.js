/**
* ...
* @author Default
* @version 0.1
*/

package view.tools{
	import flash.display.MorphShape;
	import flash.display.MovieClip;
	import flash.display.GradientType;
	import flash.geom.Matrix;
	import flash.net.*;
	import flash.text.*;
	import flash.xml.*;
	import navigation.Accordion;
	import flash.events.*;
	import flash.utils.getDefinitionByName;
	import utils.Tooltip;
	import view.View;
	import view.window.Window;

	public class ToolBar extends Window {
		private var _accordion:Accordion;
		
		private var _width:Number = 130;
		private var _height:Number = 495;
		
		private var _margin:Number;
		
		private var _panels:Array;
		private var _handleWidth:Number;
		private var _top:MovieClip;
		
		internal var win:Window;
		
		private static const showAccordion:Boolean = false;
		
		public function ToolBar() {
			/*win=new Window();
			this.addChild(win);*/
			_handleWidth = 17;
			_panels = new Array();
			_top = new MovieClip();
			_margin = 0;
			super();
			setSize(_width, _height + 20);
			
			
			this.addChild(_top);
			
			this.removeClose();
			//this.graphics.lineStyle(1, 0xBEBEBE);
			this.addEventListener(MouseEvent.MOUSE_DOWN, stopMousePropagation);
			this.addEventListener(MouseEvent.MOUSE_UP,stopMousePropagation);
			
		}
		
		public function loadTools(url:String):void {
			ToolManager.getInstance().addEventListener(AbstractToolManager.TOOLS_READY, loadXML); 
			ToolManager.getInstance().init(url);
		}
		
		private function stopMousePropagation(e:MouseEvent) {
			e.stopImmediatePropagation();
			this.stage.dispatchEvent(new MouseEvent(e.type));
		}
		
		private function loadXML(evt:Event):void {
			var toolsXML:XMLNode=ToolManager.getInstance().getToolModel();
			
			var cant = toolsXML.childNodes.length;
			var accWidth = _width - (_margin * 2);
			var accHeight = (_height - 20) - (_margin * 2);
			
			if(showAccordion)
				_accordion = new Accordion(accWidth, accHeight, cant, _handleWidth, _handleWidth, true);
			else
				_accordion = new Accordion(accWidth, accHeight, cant, 0, 0, true);
			
			_accordion.addEventListener(Accordion.EVENT_ON_CHANGE, onAccordionChange);
			this.addContent(_accordion);
			var h:Number = (accHeight - (cant * _handleWidth));
			for (var r:Number = 0; r < toolsXML.childNodes.length; r++) {
				var group:XMLNode = toolsXML.childNodes[r];
				var tSet:ToolSet = new ToolSet();
				tSet.setName(group.attributes.name);
				tSet.setSize(accWidth, h);
				for (var u:Number = 0; u < group.childNodes.length; u++ ) {
					var tool:Tool = ToolManager.getInstance().getTool(group.childNodes[u]) as Tool;
					tSet.addTool(tool);
				}
				addPanel(tSet);
			}
			_accordion.openPanel(1);
			_accordion.y = _margin;
			_accordion.x = _margin-1;
			_top.graphics.drawRect(_margin, _margin, accWidth, accHeight);
		}
		
		private function addPanel(panel:ToolSet):void {
			_panels.push(panel);
			var handle:MovieClip = new MovieClip();
			handle.graphics.lineStyle(1, 0x555555);
			//handle.graphics.beginFill(0xAAAAAA);
			var matrix:Matrix= new Matrix();
			var degrees:Number = 270;
			var radians:Number = (degrees/180) * Math.PI;
			matrix.createGradientBox(_handleWidth,_handleWidth, radians, 0, 0);
			handle.graphics.beginGradientFill(GradientType.LINEAR, [0x555555,0xEEEEEE], null, [0, 255], matrix, "pad", "rgb", 0);
			handle.graphics.drawRect(0, 0, this._width-2, (_handleWidth-1));
			handle.graphics.endFill();
			var txt:TextField = new TextField();
			handle.addChild(txt);
			txt.text = panel.getName();
			var format:TextFormat = new TextFormat(); 
			format.size = 12;
			format.font = "Tahoma";
			txt.setTextFormat(format);
			_accordion.addPanel(handle, panel);
		}
		
		public function getPanels():Array{
			return _panels;
		}
		
		override public function setSize(w:Number, h:Number):void {
			_width = w;
			_height = h;
			
			if (showAccordion)
				super.setSize(_width, _height);
			else
				super.setSize(_width, _height -17);
				
			if(_accordion){
				_accordion.setSize(w, h-60);
			}
			//win.setSize(_width, _height + 20);
			
			sizePanels();
			if (showAccordion)
				super.setSize(w, h);
			else
				super.setSize(w, h -17);
		}
		
		private function sizePanels():void {
			var h = _height - (_panels.length * _handleWidth);
			for (var i:Number = 0; i < _panels.length;i++ ) {
				_panels[i].setSize(_width,h);
			}
		}
		
		private function dragBarDown(e:MouseEvent) {
			e.target.parent.startDrag();
		}
		private function dragBarUp(e:MouseEvent) {
			e.target.parent.stopDrag();
		}
		
		private function onAccordionChange(e:Event) {
			ToolManager.getInstance().setWorkingTool(null);
		}
		
	}
	
}