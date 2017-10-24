(function() {

    function Sizable() {
        this.BaseElement_constructor();
        
        this.sizeNW=null;
		this.sizeNE=null;
		this.sizeSW=null;
		this.sizeSE=null;
		this.sizers=null;
		
		this._width=0;
		this._height=0;
		
		this._xDifference = 0;
		this._yDifference = 0;
		
		this._xStart = 0;
		this._yStart = 0;
		this._sizing = false;
		
		this.__minWidth=0;
		this.__minHeight = 0;
		
		this._sizableElement=null;
        
        this.setup();
    }
    
    Sizable.RESIZE_EVENT				 = "resize";
    Sizable.RESIZE_COMPLETE_EVENT		 = "resizeComplete";
    
    var element = facilis.extend(Sizable, facilis.Drag);

    element.DragSetup=element.setup;
    element.setup = function() {
        this.DragSetup();
    };
    
    
    element.setSizableElement=function(toSize) {
        if (!toSize || !(toSize instanceof facilis.SizableElement))
            throw Error("Object must be facilis.SizableElement");
            
        this._sizableElement = toSize;
        this._sizableElement.x = 0;
        this._sizableElement.y = 0;
        this.addChild(this._sizableElement);
        this._width = this._sizableElement.width;
        this._height = this._sizableElement.height;
        try {
            this._width = (this._sizableElement).getRealWidth();
            this._height = (this._sizableElement).getRealHeight();
        }catch (e) {

        }
        this.updateSizablePosition();
        this.addEventListener(facilis.AbstractElement.ELEMENT_OVER, this.enableSizers.bind(this));
        this.addEventListener(facilis.AbstractElement.ELEMENT_OUT, this.disableSizers.bind(this));

        //this.addEventListener("added", this.addedToStage.bind(this));
        this.addedToStage(null);
        this.addEventListener(facilis.Drag.STOP_EVENT,this.onDragged.bind(this));
    }

    element.onDragged=function(e) {
        this.updateMinSize();
    }

    element.getElement=function() {
        return this._sizableElement;
    }

    element.startSizers=function() {
        this.sizers = new facilis.BaseElement();
        this.addChild(this.sizers);
        this.sizeNE = new facilis.Sizer();
        this.sizeNW = new facilis.Sizer();
        this.sizeSE = new facilis.Sizer();
        this.sizeSW = new facilis.Sizer();
        this.sizers.addChild(this.sizeNE);
        this.sizers.addChild(this.sizeNW);
        this.sizers.addChild(this.sizeSE);
        this.sizers.addChild(this.sizeSW);

        this.initSizers();

        /*this.sizeNE.addEventListener(facilis.Drag.DRAG_EVENT, this.onSizerDrag.bind(this));
        this.sizeNE.addEventListener(facilis.Drag.STOP_EVENT, this.onSizerStop.bind(this));
        this.sizeNW.addEventListener(facilis.Drag.DRAG_EVENT, this.onSizerDrag.bind(this));
        this.sizeNW.addEventListener(facilis.Drag.STOP_EVENT, this.onSizerStop.bind(this));
        this.sizeSE.addEventListener(facilis.Drag.DRAG_EVENT, this.onSizerDrag.bind(this));
        this.sizeSE.addEventListener(facilis.Drag.STOP_EVENT, this.onSizerStop.bind(this));
        this.sizeSW.addEventListener(facilis.Drag.DRAG_EVENT, this.onSizerDrag.bind(this));
        this.sizeSW.addEventListener(facilis.Drag.STOP_EVENT, this.onSizerStop.bind(this));*/
        
        this.sizeNE.addEventListener(facilis.AbstractElement.ELEMENT_CLICK, this.setDragEvents.bind(this));
        this.sizeNW.addEventListener(facilis.AbstractElement.ELEMENT_CLICK, this.setDragEvents.bind(this));
        this.sizeSE.addEventListener(facilis.AbstractElement.ELEMENT_CLICK, this.setDragEvents.bind(this));
        this.sizeSW.addEventListener(facilis.AbstractElement.ELEMENT_CLICK, this.setDragEvents.bind(this));

    }
    
    element.setDragEvents=function(e){
        e.target.addEventListener(facilis.Drag.DRAG_EVENT, this.onSizerDrag.bind(this));
        e.target.addEventListener(facilis.Drag.STOP_EVENT, this.onSizerStop.bind(this));
    }
    
    element.removeDragEvents=function(e){
        e.target.removeEventListener(facilis.Drag.DRAG_EVENT, this.onSizerDrag.bind(this));
        e.target.removeEventListener(facilis.Drag.STOP_EVENT, this.onSizerStop.bind(this));
    }

    element.initSizers=function() {
        this.positionSizer(this.sizeNE,this._width/2,-this._height/2);
        this.positionSizer(this.sizeNW,-this._width/2,-this._height/2);
        this.positionSizer(this.sizeSE,this._width/2,this._height/2);
        this.positionSizer(this.sizeSW, -this._width / 2, this._height / 2);
        this.updateMinSize();
    }


    element.onSizerDrag=function(e) {
        /*
        problema de performance
        this.dispatchEvent(new facilis.Event(Sizable.RESIZE_EVENT));*/
        this.updateSizerPos(e.currentTarget);
    }

    element.onSizerStop=function(e) {
        this.removeDragEvents(e);
        this.updateSizerPos(e.currentTarget);
        this._sizing = false;
        this._width = this._sizableElement._width;
        this._height = this._sizableElement._height;
        this.x -= ((this._xStart - e.target.x)/2);
        this.y -= ((this._yStart - e.target.y)/2);
        this.updateSizablePosition();
        this.initSizers();
        this.dispatchEvent(new facilis.Event(facilis.Sizable.RESIZE_EVENT));
        this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DROP));
        this.dispatchEvent(new facilis.Event(facilis.Sizable.RESIZE_COMPLETE_EVENT));
    }

    element.updateSizerPos=function(sizer) {
        if (!this._sizing) {
            this._xStart = sizer.x;
            this._yStart = sizer.y;
        }
        this._sizing = true;
        var xPeer;
        var yPeer;
        if (sizer==this.sizeNW) {
            xPeer = this.sizeSW;
            yPeer = this.sizeNE;
        }else if (sizer==this.sizeNE) {
            xPeer = this.sizeSE;
            yPeer = this.sizeNW;
        }else if (sizer== this.sizeSW) {
            xPeer = this.sizeNW;
            yPeer = this.sizeSE;
        }else {
            xPeer = this.sizeNE;
            yPeer = this.sizeSW;
        }
        xPeer.x = sizer.x;
        yPeer.y = sizer.y;
        this.changeSize( Math.abs(yPeer.x - sizer.x) , Math.abs(xPeer.y - sizer.y));
        var positionerX = this.sizeNW;
        var positionerY = this.sizeNW;
        if (positionerX.x > this.sizeNE.x) {
            positionerX = this.sizeNE;
        }
        if (positionerY.y > this.sizeSW.y) {
            positionerY = this.sizeSW;
        }
        this._sizableElement.x = (positionerX.x + (positionerX.width/2));
        this._sizableElement.y = (positionerY.y + (positionerY.height / 2));

        //this.dispatchEvent(new facilis.Event("resize"));
    }

    element.updateSizablePosition=function() {
        this._sizableElement.x = -this._width / 2;
        this._sizableElement.y = -this._height / 2;
    }

    element.positionSizer=function(sizer,x,y) {
        sizer.x = x-(sizer.width/2);
        sizer.y = y-(sizer.height/2);
    }

    element.changeSize=function(width, height) {
        this._sizableElement.setSize(width, height);
    }

    element.showSizers=function() {
        this.sizers.visible = true;
    }

    element.hideSizers=function() {
        this.sizers.visible = false;
    }

    element.setSize=function(w, h) {
        this.dispatchEvent(new facilis.Event(Sizable.RESIZE_EVENT));
        var auxX = this.x;
        var auxY = this.y;
        this._width = w;
        this._height = h;
        this._sizableElement.setSize(w, h);
        this._sizableElement.x = -(this._width/2);
        this._sizableElement.y = -(this._height/2);
        this.initSizers();
        this.x = auxX;
        this.y = auxY;
        this.dispatchEvent(new facilis.Event(Sizable.RESIZE_COMPLETE_EVENT));
    }

    element.enableSizers=function(e) {
        /*Tweener.addTween(sizeNE,{alpha:1,time:.5,transition:"easeInQuart"});
        Tweener.addTween(sizeNW,{alpha:1,time:.5,transition:"easeInQuart"});
        Tweener.addTween(sizeSE,{alpha:1,time:.5,transition:"easeInQuart"});
        Tweener.addTween(sizeSW,{alpha:1,time:.5,transition:"easeInQuart"});*/
    }

    element.disableSizers=function(e) {
        /*Tweener.addTween(sizeNE,{alpha:0,time:.5,transition:"easeOutQuart"});
        Tweener.addTween(sizeNW,{alpha:0,time:.5,transition:"easeOutQuart"});
        Tweener.addTween(sizeSE,{alpha:0,time:.5,transition:"easeOutQuart"});
        Tweener.addTween(sizeSW,{alpha:0,time:.5,transition:"easeOutQuart"});*/
    }

    element.getElementWidth=function() {
        return _sizableElement.width;
    }

    element.getElementHeight=function() {
        return this._sizableElement.height;
    }

    element.getRealHeight=function() {
        return this._height;
    }

    element.getRealWidth=function() {
        return this._width;
    }

    element._added = false;
    element.addedToStage=function(e) {
        this._added = true;
        this.startSizers();
        this.removeEventListener("added", this.addedToStage);
        this.updateMinSize();
    }

    element.updateMinSize=function() {
        if (this._added && this._sizableElement instanceof facilis.SizableElement) {
            if (this._sizableElement.minHeight != 0 && this._sizableElement.minWidth != 0) {
                var maxHW = 10000;
                var minWidth = this._sizableElement.minWidth;
                var minHeight = this._sizableElement.minHeight;

                var yTL = this.y - (this.getRealHeight() / 2);
                var xTL = this.x - (this.getRealWidth() / 2);

                var nwP = new facilis.Point(-10, -10);
                var neP = new facilis.Point((minWidth + xTL), -10);
                var swP = new facilis.Point( -10, ( yTL + minHeight ) );
                var seP = new facilis.Point((minWidth + xTL),  (yTL + minHeight));

                this.parent.localToGlobal(nwP.x,nwP.y,nwP);
                this.parent.localToGlobal(neP.x,neP.y,neP);
                this.parent.localToGlobal(swP.x,swP.y,swP);
                this.parent.localToGlobal(seP.x,seP.y,seP);

                this.sizeNW.parent.globalToLocal(nwP.x,nwP.y,nwP);
                this.sizeNE.parent.globalToLocal(neP.x,neP.y,neP);
                this.sizeSW.parent.globalToLocal(swP.x,swP.y,swP);
                this.sizeSE.parent.globalToLocal(seP.x,seP.y,seP);

                this.sizeNW.boundaries = new facilis.Rectangle( nwP.x, nwP.y, ( (xTL + this._width) - minWidth), ((yTL + this._height) - minHeight ) );
                this.sizeNE.boundaries = new facilis.Rectangle(neP.x, neP.y, maxHW, (( (yTL + this._height) - minHeight ) )  );

                this.sizeSW.boundaries = new facilis.Rectangle( swP.x, swP.y,  (( (xTL + this._width) - minWidth)), maxHW );
                this.sizeSE.boundaries = new facilis.Rectangle(seP.x, seP.y, maxHW, maxHW  );
            }
        }
    }

    element.centerSizableElement=function() {
        var p = new facilis.Point(this._sizableElement.x, this._sizableElement.y);
        this.localToGlobal(p.x,p.y,p);
        this._sizableElement.x = this.getRealWidth() / -2;
        this._sizableElement.y = this.getRealHeight() / -2;
        this.parent.globalToLocal(p.x,p.y,p);
        this.x = p.x+(this.getRealWidth() / 2);
        this.y = p.y + (this.getRealHeight() / 2);
        this.updateMinSize();
        this.dispatchEvent(new facilis.Event(facilis.Sizable.RESIZE_EVENT));
        this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DROP));
    }

    
    

    facilis.Sizable = facilis.promote(Sizable, "Drag");
    
}());