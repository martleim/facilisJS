/**
* ...
* @author Default
* @version 0.1
*/

package  view.tools{
	import com.bit101.components.ScrollPane;
	import flash.display.MovieClip;

	public class ToolSet extends MovieClip{
		private var _pannel:ScrollPane;		
		private var _width:Number;
		private var _height:Number;
		private var _margin:Number;
		private var _name:String;
			
		public function ToolSet() {
			_width = 200;
			_height = 300;
			_margin = 5;
			
			_pannel = new ScrollPane(this, 0, 0);
			_pannel.setSize(_width, _height);
		}
		
		public function addTool(tool:Tool):void {
			_pannel.addElement(tool);
			sortElements();
		}
		
		public function setSize(w:Number, h:Number):void {
			_width = w;
			_height = h;
			_pannel.setSize(_width, _height);
			sortElements();
		}
		
		private function sortElements():void {
			var els:Array = _pannel.getElements();
			if (els.length > 0) {
				var elPerLine = Math.floor(_pannel.contentWidth / (els[0].width + _margin));
				for (var i:Number = 0; i < els.length; i++ ) {
					var row = Math.floor((i) / elPerLine);
					var x = ((i % elPerLine) * (els[0].width+_margin))+_margin;
					var y = (row * (els[0].height + _margin))+_margin;
					els[i].x = x;
					els[i].y = y;
				}
			}
		}
		
		public function setName(n:String) {
			_name = n;
		}
		
		public function getName():String {
			return _name;
		}
		
		public function getTools():Array {
			return _pannel.getElements();
		}
		
	}
	
}
