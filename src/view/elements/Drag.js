(function() {

    function Drag() {
        this.AbstractElement_constructor();
        
        this.moving = false;
		
        this.baseX = 0;
        this.baseY = 0;
		
		this._startX = 0;
        this._startY = 0;
        
        this._startLocalX = 0;
        this._startLocalY = 0;
        
        this._stage=null;
        this._center = false;
        
		this._dragBoundaries = null;
    
    }
    
    var element = facilis.extend(Drag, facilis.AbstractElement);
    
    Drag.DRAG_EVENT				 = "drag";
    Drag.STOP_EVENT				 = "stop";
    Drag.RESET_EVENT			 = "resetStart";

    Drag.dragDisable             = false;



    element.AbstractElementSetup=element.setup;
    element.setup = function() {
        this.AbstractElementSetup();
        
        this.addEventListener("pressmove", this.pressMove.bind(this));
        //this.addEventListener("mouseup", this.onMouseUp);
        //this.addEventListener("added", this.addedToStage);
        
    };
    
    this.addedToStage=function(e) {
        this._stage = this.stage;
        this.removeEventListener("added", this.addedToStage);
    }
    
    
    element.pressMove=function(e) {
        var el = e.currentTarget;
		e.stopPropagation();
        if(!Drag.dragDisable){
            if (!this.moving) {
				this._startX = Math.round(el.x);
                this._startY = Math.round(el.y);
                this._startLocalX = Math.round(e.localX);
                this._startLocalY = Math.round(e.localY);
                this.removeListenersUp();
                this.addEventListener("pressup", el.pressUp.bind(this));
            }
            
            var p={};
            this.parent.globalToLocal(e.stageX,e.stageY,p);

            this.x = Math.round(p.x-this._startLocalX);
            this.y = Math.round(p.y-this._startLocalY);
            
            this.moving = true;

            this.parent.setChildIndex(this, this.parent.numChildren-1);
            this.dispatchEvent(new facilis.Event(facilis.Drag.DRAG_EVENT));
        }
        e.stopImmediatePropagation();
    }
    element.pressUp=function(e) {
        var el = e.currentTarget;
		e.stopPropagation();
        if(!Drag.dragDisable && el.moving){
            //el.stopDrag();
            el.dispatchEvent(new facilis.Event(Drag.DRAG_EVENT));
            el.dispatchEvent(new facilis.Event(Drag.STOP_EVENT));
        }
        if(el.moving){
            el.moving = false;
        }
        el.removeListenersUp();

        el._startX = el.x;
        el._startY = el.y;

        if(el.moving){
            el.moving = false;
        }
		e.stopImmediatePropagation();
    }
    
    element.removeListenersUp=function () {
        //this.removeEventListener("pressup", this.pressUp.bind(this));
    }

    element.resetStart=function () {
        this._startX = this.baseX;
        this._startY = this.baseY;
        this.dispatchEvent(new facilis.Event(Drag.RESET_EVENT));
    }

    element.moveTo=function(_x,_y) {
        this.x = _x;
        this._startX = _x;
        this.y = _y;
        this._startY = _y;
    }
	
	element.getDragLimits=function() {
        var rx = this.width / 2;
        var ry = this.height / 2;
        var w = this.stage.stageWidth - rx;
        var h = this.stage.stageHeight - ry;

        w += this.width;
        h += this.height;

        var p = new facilis.Point(w, h);
        p = this.parent.globalToLocal(p);
        w = p.x;
        h = p.y;
        var rect = new facilis.Rectangle(rx, ry, w, h);
        return rect;
    }
	
	element.moveX=function (_x) {
		this._startX = this._startX||this.baseX;
        this.baseX = parseInt(this._startX) +parseInt(_x);
    }

    element.moveY=function (_y) {
		this._startY = this._startY||this.baseY;
        this.baseY = parseInt(this._startY) +parseInt(_y);
    }
	
	Object.defineProperty(element, 'movedX', {
        get: function() { 
			this._startX = this._startX||this.baseX;
			return this.baseX-this._startX; 
		}
    });
    
    Object.defineProperty(element, 'movedY', {
        get: function() { 
			this._startY = this._startY||this.baseY;
			return this.baseY-this._startY; 
		}
    });
    
	Object.defineProperty(element, 'dragBoundaries', {
        set: function(newValue) { 
			if(newValue==null || newValue instanceof facilis.Rectangle)
				this._dragBoundaries = newValue; 
		
		}
    });
	
    /*element.baseX=element.x;
    element.x=null;*/
    Object.defineProperty(element, 'x', {
        get: function() { 
			return this.baseX; 
		},
        set: function(newValue) { 
			if(!this._dragBoundaries || 
			  (this._dragBoundaries && this._dragBoundaries.contains(new facilis.Point(newValue,this._dragBoundaries.y))) ){
				this.baseX = newValue;
				//this._startX = newValue; 
			}
        }
    });
    
    /*element.baseY=element.y;
    element.y=null;*/
    Object.defineProperty(element, 'y', {
        get: function() { return this.baseY; },
        set: function(newValue) { 
			if(!this._dragBoundaries || 
			  (this._dragBoundaries && this._dragBoundaries.contains(new facilis.Point(this._dragBoundaries.x,newValue))) ){
				this.baseY = newValue;
				//this._startY = newValue; 
			 }
        }
    });
    
    Object.defineProperty(element, 'center', {
        get: function() { return this._center; },
        set: function(newValue) { this._center = newValue; }
    });
    
	facilis.Drag = facilis.promote(Drag, "AbstractElement");
    
}());