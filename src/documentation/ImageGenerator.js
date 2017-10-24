package documentation 
{
	import flash.geom.Rectangle;
	import flash.utils.ByteArray;
	import org.alivepdf.encoding.JPEGEncoder;
	import com.adobe.images.JPGEncoder;
	import view.elements.AbstractElement;
	import view.elements.line.LineObject;
	import view.View;
	import utils.*;
	import com.formatlos.as3.lib.display.*;
	import flash.net.FileReference;
	import flash.display.*;
	import com.formatlos.as3.lib.display.events.*;
	import flash.events.Event;
	/**
	 * ...
	 * @author ...
	 */
	public class ImageGenerator {
		
		private var x:Number = 10000;
		private var y:Number = 10000;
		private var x2:Number = 0;
		private var y2:Number = 0;
		
		public function ImageGenerator() {
		}
		
		public function saveImageFile():void {
			var elements:Array = View.getInstance().getElements();
			if (elements.length == 0) {
				AbstractMain.hideWaitMessage();
				AbstractMain.message("There are no Elements");
				return;
			}
			x = 10000;
			y = 10000;
			x2 = 0;
			y2 = 0;
			
			var logo:MovieClip = LibraryManager.getInstance().getInstancedObject("BPMNDesignerLogo") as MovieClip;
			View.getInstance().getElementView().addChild(logo);
			logo.scaleX = .5;
			logo.scaleY = .5;
			if (imgWidtht < logo.width) {
				imgWidtht = logo.width + 30;
			}
			logo.x = (x + (imgWidtht - logo.width)) - 5;
			//logo.y = y + (imgHeight - logo.height);
			logo.y = y + 20;
			
			elements = elements.concat(View.getInstance().getLineView().getElements());
			for (var i:Number = 0; i < elements.length; i++ ) {
				if ((elements[i] as AbstractElement) is LineObject) {
					var l:LineObject = (elements[i] as AbstractElement);
					var lx:Number = l.getLineX();
					var lx2:Number = lx+l.getLineWidth();
					var ly:Number = l.getLineY();
					var ly2:Number = ly + l.getLineHeight();
					if (x > lx) {
						x = lx;
					}
					if (y > ly) {
						y = ly;
					}
					if (x2 < lx2) {
						x2 = lx2;
					}
					if (y2 < ly2) {
						y2 = ly2;
					}
				}else if ((elements[i] as AbstractElement).elementType != "swimlane") {
					if (x > elements[i].x-(elements[i].width/2)) {
						x = elements[i].x-(elements[i].width/2);
					}
					if (y > elements[i].y-(elements[i].height/2)) {
						y = elements[i].y-(elements[i].height/2);
					}
					if (x2 < (elements[i].x+(elements[i].width/2))) {
						x2 = (elements[i].x+(elements[i].width/2));
					}
					if (y2 < (elements[i].y+(elements[i].height/2))) {
						y2 = (elements[i].y+(elements[i].height/2));
					}
				}
				elements[i].visible = true;
			}
			var imgWidtht:Number = (x2 + 20) - x;
			var imgHeight:Number = (y2 + 20) - y;
			x -= 10;
			y -= 10;
			//fileTo = new FileReference();
			
			logo.parent.removeChild(logo);
			//var a:BitmapData = new BitmapData(imgWidtht, imgHeight);
			var a:BitmapDataUnlimited= new BitmapDataUnlimited();
			a.addEventListener(BitmapDataUnlimitedEvent.COMPLETE, bitmapReady);
			a.create(imgWidtht, imgHeight,true,0xFFFFFF);
			/*var b:Bitmap = new Bitmap(a);
			
			var matrix:Matrix = new Matrix(1, 0, 0, 1, -x, -y);
			
			
			a.draw(View.getInstance().getElementView(), matrix);
			a.draw(View.getInstance().getLaneView(),matrix);
			a.draw(View.getInstance().getLineView(),matrix);
			
			
			//a.draw(View.getInstance().getElementView());
			//a.draw(View.getInstance().getLaneView());
			//a.draw(View.getInstance().getLineView());
			var encoder:JPGEncoder = new JPGEncoder(80);
			var ba:ByteArray = encoder.encode(a);
			//a.draw(logo);
			logo.parent.removeChild(logo);
			fileTo = new FileReference();
			fileTo.save(ba, "map.");*/
		}
		
		private function bitmapReady(e:BitmapDataUnlimitedEvent):void {
			/*var elements:Array = View.getInstance().getElements();
			var x:Number = 10000;
			var y:Number = 10000;
			var x2:Number = 0;
			var y2:Number = 0;
			for (var i = 0; i < elements.length; i++ ) {
				if ((elements[i] as AbstractElement).elementType != "swimlane") {
					if (x > elements[i].x-(elements[i].width/2)) {
						x = elements[i].x-(elements[i].width/2);
					}
					if (y > elements[i].y-(elements[i].height/2)) {
						y = elements[i].y-(elements[i].height/2);
					}
					if (x2 < (elements[i].x+(elements[i].width/2))) {
						x2 = (elements[i].x+(elements[i].width/2));
					}
					if (y2 < (elements[i].y+(elements[i].height/2))) {
						y2 = (elements[i].y+(elements[i].height/2));
					}
				}
				elements[i].visible = true;
			}*/
			var imgWidtht:Number = (x2 + 20) - x;
			var imgHeight:Number = (y2 + 20) - y;
			x -= 10;
			y -= 10;
			var logo:MovieClip = LibraryManager.getInstance().getInstancedObject("BPMNDesignerLogo") as MovieClip;
			View.getInstance().getElementView().addChild(logo);
			
			logo.scaleX = .5;
			logo.scaleY = .5;
			if (imgWidtht < logo.width) {
				imgWidtht = logo.width + 30;
			}
			View.getInstance().getElementView().graphics.beginFill(0xFFFFFF);
			View.getInstance().getElementView().graphics.drawRect(x-5, y-5, imgWidtht+10, imgHeight+10);
			View.getInstance().getElementView().graphics.endFill();
			logo.x = (x + (imgWidtht - logo.width)) - 30;
			//logo.y = y + (imgHeight - logo.height);
			logo.y = y + 20;
			
			
			var a:BitmapDataUnlimited = e.currentTarget;
			//var b:Bitmap = new Bitmap(a);
			
			//var matrix:Matrix = new Matrix(1, 0, 0, 1, -x, -y);
			
			/*a.draw(View.getInstance().getElementView(), matrix);
			a.draw(View.getInstance().getLaneView(),matrix);
			a.draw(View.getInstance().getLineView(),matrix);*/
			
			a.draw(View.getInstance().getElementView(), null, null, new Rectangle(x, y, imgWidtht, imgHeight));
			a.draw(View.getInstance().getLaneView(), null, null, new Rectangle(x, y, imgWidtht, imgHeight));
			a.draw(View.getInstance().getLineView(), null, null, new Rectangle(x, y, imgWidtht, imgHeight));
			
			//a.draw(View.getInstance().getElementView());
			//a.draw(View.getInstance().getLaneView());
			//a.draw(View.getInstance().getLineView());
			var encoder:JPGEncoder = new JPGEncoder(100);
			//var ba:ByteArray = encoder.encode(a);
			var ba:ByteArray = encoder.encode(a.bitmapData);
			//a.draw(logo);
			logo.parent.removeChild(logo);
			View.getInstance().getElementView().graphics.clear();
			fileTo = new FileReference();
			fileTo.save(ba, "map.jpg");
			AbstractMain.hideWaitMessage();
			fileTo.addEventListener(Event.SELECT, function(e:Event):void {
				AbstractMain.message("Image Generated OK");
			});
			fileTo.addEventListener(Event.CANCEL, function(e:Event):void {
				AbstractMain.message("Image Not Saved");
			});
		}
		
	}

}