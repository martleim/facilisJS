(function() {

    function Sizer() {
        this.Drag_constructor();
        
        this._sizerRectangle=null;
        
        this.radio=2;
        
        this.width=5;
        this.height=5;
        
    }
    
    var element = facilis.extend(Sizer, facilis.Drag);

    element.DragSetup=element.setup;
    element.setup = function() {
        this.DragSetup();
        var graphics = new facilis.Graphics();
        graphics.beginFill("#AAAAAA",0);			
        graphics.drawRect(0,0, 5, 5);
        graphics.endFill();
        graphics.lineStyle(1,"#000000");
        graphics.beginFill("#AAAAAA");			
        graphics.drawCircle( this.radio, this.radio, this.radio);
        graphics.endFill();
        this.addShape(new facilis.Shape(graphics));
    };
    
    element.mouseDown=function(e) {
        var el = e.currentTarget;
        if(!Drag.dragDisable){
            if (!moving) {
                _startX = this.x;
                _startY = this.y;
            }
            moving = true;
            /*if(!_stage){
                _stage = this.stage;
            }*/
            /*_stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseMove);
            _stage.addEventListener(MouseEvent.MOUSE_UP, onStageMouseUp);
            this.addEventListener(MouseEvent.MOUSE_UP, onMouseUp);*/
            this.startDrag(center,_sizerRectangle);
            this.parent.setChildIndex(this, this.parent.numChildren-1);
            //this.dispatchEvent(new facilis.Event("drag"));
            e.stopPropagation();
        }
    }
    
    /*element.baseHeight=element.height;
    Object.defineProperty(element, 'height', {
        get: function() { return (element.baseHeight || (this.radio*2)); },
        set: function(newValue) { this.baseHeight = newValue; }
    });
    
    element.baseWidth=element.width;
    Object.defineProperty(element, 'width', {
        get: function() { return (element.baseWidth || (this.radio*2)); },
        set: function(newValue) { this.baseWidth = newValue; }
    });*/

    Object.defineProperty(element, 'boundaries', {
        set: function(newValue) { 
			this._sizerRectangle = newValue;
			this.dragBoundaries = newValue;
		}
    });
    
    facilis.Sizer = facilis.promote(Sizer, "Drag");
    
}());