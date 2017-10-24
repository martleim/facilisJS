/**
* ...
* @author Default
* @version 0.1
*/

package view.tools{
	import flash.display.DisplayObject;
	import flash.display.MovieClip;
	import flash.events.MouseEvent;
	import flash.filters.GlowFilter;
	import flash.xml.XMLNode;
	import view.elements.AbstractElement;

	public class Tool extends AbstractTool {
		
		internal var icon:MovieClip;
		internal var top:MovieClip;
		internal var _type:String;
		internal var _className:String;
		internal var _selected:Boolean;
		internal var _color;
		internal var _hoverGlow:GlowFilter;
		internal var _element:AbstractElement;
		internal var _disabled:Boolean = false;
		
		public function Tool() { 
			super();
			icon = new MovieClip();
			top = new MovieClip();
			draw();
			this.addEventListener(MouseEvent.MOUSE_OVER, onMouseOver);
			this.addEventListener(MouseEvent.MOUSE_OUT, onMouseOut);
		}
		
		override public function unselectTool():void{
		}
		
		public function draw():void{
			this.addChild(icon);
			this.addChild(top);
			top.graphics.lineStyle(1, 0x000000,0); 
			top.graphics.beginFill(0x999999, 0); 
			top.graphics.drawRect(0, 0, 50, 50);
		}
		
		override public function addIcon(i:MovieClip):void {
			icon.addChild(i);
		}
		
		internal function getIcon():DisplayObject {
			return icon.getChildAt(0);
		}
		
		internal function getTop():MovieClip {
			return top;
		}
		
		override public function setAttributes(node:XMLNode):void{}
		
		public function get type():String {
			return _type;
		}
		
		public function set type(t:String):void {
			_type=t;
		}
		
		public function set className(c:String):void {
			_className=c;
		}
		
		public function get className():String {
			return _className;
		}
		
		public function set selected(s:Boolean):void {
			_selected=s;
		}
		
		public function get selected():Boolean {
			return _selected;
		}
		
		public function set color(c):void {
			_color=c;
		}
		
		public function get color() {
			return _color;
		}
		
		public function set element(e:AbstractElement):void {
			_element=e;
		}
		
		public function get element():AbstractElement {
			return _element;
		}
		
		private function onMouseOver(e:MouseEvent):void {
			var col:uint = 0xFFFFFF;
			if (color) {
				col = uint(color);
			}
			if(!_hoverGlow){
				_hoverGlow = new GlowFilter(col,.8, 15, 15, 1, 3, true);
			}
			var arr:Array = this.filters;
			arr.push(_hoverGlow);
			this.filters = arr;
		}
		
		private function onMouseOut(e:MouseEvent):void {
			//this.filters = [];
			var arr:Array = this.filters;
			for (var i:Number = 0; i < arr.length; i++ ) {
				if (arr[i].color == _hoverGlow.color) {
					arr.splice(i, 1);
				}
			}
			this.filters = arr;
		}
		
		public function set disabled(d:Boolean):void {
			_disabled = d;
		}
		
	}
	
}