(function() {

    function ZoomScroll() {
        this.BaseElement_constructor();
        
        this.back;
		this.handle;
		
		this._width=200;
		this._height = 20;
		
		this._backW = null;
		this._backH = null;
		
		this._zoom;

        this.setup();
    }
    
    ZoomScroll.ON_ZOOM = "onZoomed";
    ZoomScroll.ON_ZOOMEND = "onZoomEnd";
    
    
    var element = facilis.extend(ZoomScroll, facilis.BaseElement);

    
    element.setup = function() {
        this.back = new facilis.BaseElement();
        this.handle = new facilis.BaseElement();
        this.addChild(this.back);
        this.addChild(this.handle);
        this.drawBack();
        this.drawHandle();
        this.handle.addEventListener("pressmove", this.onHandleDownMove.bind(this));
        this.handle.addEventListener("pressup", this.pressUp.bind(this));
        facilis.View.getInstance().addEventListener(Event.RESIZE, this.onResize.bind(this));
        //facilis.View.getInstance()._stage.addEventListener(MouseEvent.MOUSE_WHEEL, onMouseWheel);
    } ;

    element.drawBack=function() {
        this.back.graphics=new facilis.Graphics();
        
        this.back.graphics.lineStyle(2,"#999999");
        
        this.back.graphics.beginFill("rgba(99,99,99,.9)");
        this.back.graphics.drawRoundRect(0, 0, this._width, this._height, 15, 15);
        this.back.graphics.endFill();

        this.back.graphics.lineStyle(1,"#666666");

        this.back.graphics.beginFill("rgba(240,240,240,.9)");
        this.back.graphics.drawRoundRect( ( this._width/2-( (this._width-20)/2 ) ), ( this._height/2-( (5)/2 ) ), this._width-20, 5, 5, 5);
        this.back.graphics.endFill();
        
        this.back.graphics.lineStyle(2,"#999999");
        
        this.back.graphics.moveTo((this._width / 2), -2);
        this.back.graphics.lineTo((this._width / 2), 5);
        this.back.graphics.moveTo((this._width / 2), this._height-5);
        this.back.graphics.lineTo((this._width / 2), this._height+2);
        this.back.addShape(new facilis.Shape(this.back.graphics));
        //this.back.cache(-(this._width+20 / 2),-10,(this._width+20 / 2),this._height+20);
        this.back.cache(-10,-10,this._width+10,this._height+10);

    }

    element.drawHandle=function() {
        this.handle.graphics=new facilis.Graphics();
        this.handle.graphics.beginFill("rgba(99,99,99,.01)");
        this.handle.graphics.drawRect( -15, -15, 30, 30);
        this.handle.graphics.endFill();
        
        this.handle.graphics.lineStyle(2,"#999999");
        
        this.handle.graphics.beginFill("rgba(99,99,99,.9)");
        //this.handle.graphics.drawRoundRect(0, 0, 15, 15, 15, 15);
        this.handle.graphics.drawCircle(0, 0, 8);
        this.handle.graphics.endFill();
        this.handle.x = (this._width / 2);// - (this.handle.width / 2);
        this.handle.y = (this._height / 2);// - (this.handle.height / 2);
        this.handle.addShape(new facilis.Shape(this.handle.graphics));
        this.handle.cache(-10,-10,20,20);

    }

    element.onHandleDownMove=function(e) { 
        e.stopPropagation();
        var x = 10;
        var w = (this._width - 20);
        //this.handle.startDrag(false, new Rectangle(x, this._height / 2, w, 0));
        
        var p={};
        this.handle.parent.globalToLocal(e.stageX,0,p);
        
        this.handle.x = Math.min(w, Math.max(x, p.x));
        this.handle.y = this._height/2;
     
        this.updateZoom();
    }
    
    element.pressUp=function(e) { 
        e.stopPropagation();
        this.dispatchEvent(new facilis.Event(ZoomScroll.ON_ZOOMEND));
    }

    element.updateZoom=function() {
        var z =  this.handle.x - (this._width / 2);
        if (z<0) {
            z = Math.abs(z / 100) + 1;
            z = 1 / z;
        }else if (z == 0) {
            z = 1;
        }else if (z > 0) {
            z = (100+z) / 100;
        }
        this._zoom = z;
        this.dispatchEvent(new facilis.Event(ZoomScroll.ON_ZOOM));
        facilis.View.getInstance().zoom(z);
    }

    element.onResize=function(e) {
        this.positionMe(this._backW,this._backH);
    }

    element.positionMe=function(w, h) {
        if(!w){
            w = facilis.View.getInstance().getStageWidth();
        }
        this._backW = w;
        if(!h){
            h = facilis.View.getInstance().getStageHeight();
        }
        this._backH = h;
        this.x = (w - this._width) - 20;
        this.y = (h - this._height) - 20;
    }

    element.resetZoom=function() {
        this.handle.x = (this._width / 2);
        this._zoom = 1;
        facilis.View.getInstance().zoom(1);
    }

    element.onMouseWheel=function(e) {
        var w = (this._width - 20);
        var delta = 10;
        if (e.delta < 3) {
            delta = -10;
        }
        this.handle.x += delta;
        if (this.handle.x<10) {
            this.handle.x = 10;
        }
        if (this.handle.x>w) {
            this.handle.x = w;
        }
        this.updateZoom();
    }
    
    Object.defineProperty(element, 'zoom', {
        get: function() { return this._zoom; },
        set: function(z) { 
            this._zoom = z;
            this.handle.x = this._zoom * (this._width / 2);

            this.dispatchEvent(new facilis.Event(ZoomScroll.ON_ZOOM));
            facilis.View.getInstance().zoom(z);
        }
    });


    facilis.ZoomScroll = facilis.promote(ZoomScroll, "BaseElement");
    
}());
