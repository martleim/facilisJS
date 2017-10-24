(function() {

    function LineSegment(s, e) {
        if(!s && !e)
            throw Error("Start and End elements can not be null");
        
        this.BaseElement_constructor();
        
        this.startPoint=s;
		this.endPoint=e;
		
        this.lineStyle="";
		this.lineWidth=facilis.LineObject.lineWidth;
		this.lineColor=facilis.LineObject.lineColor;
		
		this.thinLine=null;
		this.backLine=null;
		
		this.type = "";
		
		this.segmentStartX = 0;
		this.segmentStartY = 0;
		
		this.segmentEndX = 0;
		this.segmentEndY = 0;
        
        this._accThreshold=6;
        
        this.segPoint=null;
		
        this.setup();
    }
    
    var element = facilis.extend(LineSegment, facilis.BaseElement);

    element.setup = function() {
    };
    
    
    
    element.updateSegment=function(_acc) {
            _acc=_acc||true;
			var point1 = new facilis.Point(this.startPoint.x, this.startPoint.y);
			var point2 = new facilis.Point(this.endPoint.x, this.endPoint.y);
			if(this.startPoint.parent && this.endPoint.parent){
                this.startPoint.parent.localToGlobal(point1.x,point1.y,point1)
                this.endPoint.parent.localToGlobal(point2.x,point2.y,point2);
                
                var epoint = null;
				var spoint = null;
                
                if(this.startPoint.getIntersectionWidthSegment){
                    spoint=this.startPoint.getIntersectionWidthSegment(point1,point2);
                }
                
                if(this.endPoint.getIntersectionWidthSegment){
                    epoint=this.endPoint.getIntersectionWidthSegment(point1,point2);
                }
                
                
				this.parent.globalToLocal(point2.x,point2.y,point2);
				this.parent.globalToLocal(point1.x,point1.y,point1);
                
                var x1=point1.x;
				var y1=point1.y;
				var x2=point2.x;
				var y2 = point2.y;
				
				var sin=x1-x2;
				var cos=y1-y2;

				var angle=-(Math.atan2(sin,cos)*(180/Math.PI));
				var dist = 0;
				
				if(!epoint){
                    epoint = new facilis.Point(x2, y2);
                    this.endPoint.parent.localToGlobal(epoint.x,epoint.y,epoint);
                    while (( this.endPoint.x && this.endPoint.y && this.endPoint.LocalhitTest( epoint.x , epoint.y) && _acc )|| (!_acc && dist==0) ) {
                        dist-=this._accThreshold;
                        epoint = new facilis.Point((x2 + ( Math.cos((angle - 90) * (Math.PI / 180)) * dist )), ( y2 + ( Math.sin((angle - 90) * (Math.PI / 180)) * dist ) ));
                        this.endPoint.parent.localToGlobal(epoint.x,epoint.y,epoint);
                    }
                }
				
                if(!spoint){
                    dist = 0;
                    spoint = new facilis.Point(x1, y1);
                    this.startPoint.parent.localToGlobal(spoint.x,spoint.y,spoint);
                    while (( this.startPoint.x && this.startPoint.y && this.startPoint.LocalhitTest( spoint.x , spoint.y) && _acc) || (!_acc && dist==0)) {
                        dist +=this._accThreshold;
                        spoint = new facilis.Point((x1 + ( Math.cos((angle - 90) * (Math.PI / 180)) * dist )), ( y1 + ( Math.sin((angle - 90) * (Math.PI / 180)) * dist ) ));
                        this.startPoint.parent.localToGlobal(spoint.x,spoint.y,spoint);
                    }
                }
                
				this.endPoint.parent.globalToLocal(epoint.x,epoint.y,epoint);
				this.startPoint.parent.globalToLocal(spoint.x,spoint.y,spoint);
				
				this.segmentStartX = spoint.x;
				this.segmentStartY = spoint.y;
				this.segmentEndX = epoint.x;
				this.segmentEndY = epoint.y;
				
				this.drawLineFromTo(this.thinLine,spoint.x,spoint.y,epoint.x,epoint.y);
			}
			
		}
		
		element.getStartElement=function(){
			return this.startPoint;
		}
		element.getEndElement=function(){
			return this.endPoint;
		}
		element.setStartElement=function(point){
			this.startPoint=point;
		}
		element.setEndElement=function(point){
			this.endPoint=point;
		}
		
		element.setType=function(t){
			this.type=t;
		}
		
		element.drawLineFromTo=function(mc, startx, starty , endx, endy) {
			if (this.backLine ==null) {
                this.backLine = new facilis.BaseElement();
                this.addChild(this.backLine);
                this.backLine.graphics = new facilis.Graphics();
			}
            this.backLine.graphics.clear();
            this.backLine.removeAllChildren();
			
			if (this.thinLine ==null) {
                this.thinLine = new facilis.BaseElement();
                this.addChild(this.thinLine);
                this.thinLine.graphics = new facilis.Graphics();
			}
            this.thinLine.graphics.clear();
            this.thinLine.removeAllChildren();

			//thinLine.graphics.lineStyle(lineWidth,lineColor,60,false);
            
            
            this.thinLine.graphics.lineStyle(this.lineWidth,this.lineColor);
            this.thinLine.addShape(new facilis.Shape(this.thinLine.graphics));
            
            this.backLine.graphics.lineStyle(15,"rgba(100,100,100,.01)");
            this.backLine.addShape(new facilis.Shape(this.backLine.graphics));
            
			//graphics.lineStyle(lineWidth, lineColor, 1, false);
			//backLine.graphics.lineStyle(15, lineColor, 0, false);
            
			if(this.type=="dashed"){
				facilis.LineUtils.dashTo(this.thinLine, startx, starty, endx, endy, 5, 7);
				facilis.LineUtils.dashTo(this.backLine, startx, starty, endx, endy, 5, 5);
			}else if (this.type == "dotted") {
				facilis.LineUtils.dashTo(this.thinLine,startx, starty, endx, endy, 1, 4);
				facilis.LineUtils.dashTo(this.backLine, startx, starty, endx, endy, 5, 5);
			}else if (this.type == "dashdotted") {
				facilis.LineUtils.dashDotTo(this.thinLine, startx, starty, endx, endy, 5, 7);
				facilis.LineUtils.dashTo(this.backLine, startx, starty, endx, endy, 5, 5);
			}else {
				this.thinLine.graphics.moveTo(startx,starty);
				this.thinLine.graphics.lineTo(endx,endy);
				this.backLine.graphics.moveTo(startx,starty);
				this.backLine.graphics.lineTo(endx, endy);
				
				//thinLine.graphics.drawRect(50, 50, 100, 500);
				
			}
		}
        
        element.uncacheSegment=function(){
            this.uncache();
        }

        element.cacheSegment=function(){
            var x=Math.min(this.segmentStartX,this.segmentEndX);
            var y=Math.min(this.segmentStartY,this.segmentEndY);
            
            var w=Math.abs(this.segmentStartX - this.segmentEndX);
            var h=Math.abs(this.segmentStartY - this.segmentEndY);
            this.cache(x,y,w,h);
        }
		
		element.remove=function(){
			this.parent.removeChild(this);
		}
		
		element.getLength=function(){
			return Math.sqrt( Math.pow(this.segmentEndX-this.segmentStartX, 2) + Math.pow(this.segmentEndY-this.segmentStartY, 2) );
		}
		
		
		
		element.getSegmentPoint=function(length) {
			if (this.segPoint) {
				this.segPoint.parent.removeChild(this.segPoint);
				this.segPoint = null;
			}
			var xLength=this.segmentEndX-this.segmentStartX;
			var yLength=this.segmentEndY-this.segmentStartY;
			var cotang=Math.atan2(yLength,xLength);
			
			var minX = this.segmentStartX;
			var minY = this.segmentStartY;
			
			var point = new facilis.Point((Math.cos(cotang) * length) + minX, (Math.sin(cotang) * length) + minY);
			return point;
		}
		
		
		element.getIntersection=function(at,to) {
			var point1 = new facilis.Point(at.x, at.y);
			var point2 = new facilis.Point(to.x, to.y);

			point1 = this.parent.globalToLocal(at.parent.localToGlobal(point1));
			point2 = this.parent.globalToLocal(to.parent.localToGlobal(point2));
			
			var x1 = point1.x;
			var y1 = point1.y;
			var x2 = point2.x;
			var y2 = point2.y;
			
			//var sin = x1 - x2;
			//var cos = y1 - y2;
			var sin = x2 - x1;
			var cos = y2 - y1;

			var angle = -(Math.atan2(sin, cos) * (180 / Math.PI));
			
			var dist = Math.sqrt( Math.pow(sin, 2) + Math.pow(cos, 2) );
			var aprox = dist;
			
			var spoint = new facilis.Point(x1, y1);
			spoint = startPoint.parent.localToGlobal(spoint);
			var count = 0;
			//while (  (spoint.x>(at.x-at.width)) &&  (spoint.x<(at.x+at.width)) && (spoint.y>(at.y-at.height)) &&  (spoint.y<(at.y+at.height)) && count<10) {
			while (  !(spoint.x>(at.x-at.width)) &&  !(spoint.x<(at.x+at.width)) && !(spoint.y>(at.y-at.height)) &&  !(spoint.y<(at.y+at.height)) && count<10) {
				count++;
				aprox = aprox / 2;
				var pointLess = new facilis.Point((x2 + ( Math.cos((angle - 90) * (Math.PI / 180)) * (dist - aprox) )), ( y2 + ( Math.sin((angle - 90) * (Math.PI / 180)) * (dist - aprox) ) ));
				var pointMore = new facilis.Point((x2 + ( Math.cos((angle - 90) * (Math.PI / 180)) * (dist + aprox) )), ( y2 + ( Math.sin((angle - 90) * (Math.PI / 180)) * (dist + aprox) ) ));
				
				pointLess = endPoint.parent.localToGlobal(pointLess);
				pointMore = endPoint.parent.localToGlobal(pointMore);
				//pointLess = this.parent.globalToLocal(at.parent.localToGlobal(pointLess));
				//pointMore = this.parent.globalToLocal(at.parent.localToGlobal(pointMore));
				
				if (  (pointLess.x > (at.x - at.width)) &&  (pointLess.x < (at.x + at.width)) && (pointLess.y > (at.y - at.height)) &&  (pointLess.y < (at.y + at.height)) && aprox > 5 ) {
					dist += aprox;
					spoint = pointMore;
				}else {
					dist -= aprox;
					spoint = pointLess;
				}
				//trace(count+" "+dist+" "+aprox);
			}
			
			/*while (!at.hitTestPoint( spoint.x , spoint.y, true) ) {
				dist-=this._accThreshold;
				spoint = new Point((x2 + ( Math.cos((angle - 90) * (Math.PI / 180)) * dist - aprox )), ( y2 + ( Math.sin((angle - 90) * (Math.PI / 180)) * dist ) ));
			}*/
			
			
			spoint = this.globalToLocal(spoint);
				
			return spoint;
		}

		element.getStartPoint=function() {
			return new facilis.Point(this.segmentStartX, this.segmentStartY);
		}
		
		element.getEndPoint=function() {
			return new facilis.Point(this.segmentEndX, this.segmentEndY);
		}
		
    

    
    facilis.LineSegment = facilis.promote(LineSegment, "BaseElement");
    
}());