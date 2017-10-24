(function() {

    function AbstractElement() {
        this.BaseElement_constructor();
        
        this._selected=false;
        this._elementType=null;
        this.data=null;

        this.setup();
    }
    
    facilis.EventDispatcher.initialize(AbstractElement.prototype);
    
    AbstractElement.lineWidth				= 1.4;
    AbstractElement.color					= "#AACCFF";
    AbstractElement.lineColor				= "#666666";

    AbstractElement.ELEMENT_CLICK		     = "onElementClick";
    AbstractElement.ELEMENT_CLICKED			 = "onElementClicked";
    AbstractElement.ELEMENT_OVER			 = "onElementOver";
    AbstractElement.ELEMENT_OUT				 = "onElementOut";
    AbstractElement.ELEMENT_DROP 			 = "onElementDrop";
    AbstractElement.ELEMENT_DROPIN			 = "onElementDropIn";
    AbstractElement.ELEMENT_DROPOUT			 = "onElementDropOut";
    AbstractElement.ELEMENT_MOVED			 = "onElementMoved";
    AbstractElement.ELEMENT_MOVE_END		 = "onElementMovedEnd";
    AbstractElement.ELEMENT_ADDED			 = "onElementAdded";
    AbstractElement.ELEMENT_DELETE			 = "onElementDelete";
    AbstractElement.ELEMENT_DELETED			 = "onElementDeleted";
    AbstractElement.ELEMENT_DRAG			 = "onElementDrag";
	AbstractElement.ELEMENT_DRAGGED			 = "onElementDragged";
    AbstractElement.ELEMENT_DOUBLE_CLICKED	 = "onElementDoubleClicked";
    AbstractElement.ELEMENT_SELECTED		 = "onElementSelected";
    AbstractElement.ELEMENT_UNSELECTED		 = "onElementUnselected";
    
    
    var element = facilis.extend(AbstractElement, facilis.BaseElement);

    element.setup = function() {
        
        this.addEventListener("click", this.onClicked.bind(this));
        this.addEventListener("mousedown", this.onClick.bind(this));
        this.addEventListener("rollover", this.onMouseOver.bind(this));
        this.addEventListener("rollout", this.onMouseOut.bind(this));
        this.addEventListener("dblclick", this.onDoubleClick.bind(this)); 
        
        this.cursor = "pointer";
        
        this.offset = Math.random()*10;
        this.count = 0;
    } ;

    element.onClicked = function (event) {
        event.stopPropagation();
        this.dispatchMouseEvent(facilis.AbstractElement.ELEMENT_CLICKED,event);
    };
    
    element.onClick = function (event) {
        event.stopPropagation();
        this.dispatchMouseEvent(facilis.AbstractElement.ELEMENT_CLICK,event);
    };
    
    element.onMouseOver = function (event) {       
        event.stopPropagation();
        this.dispatchMouseEvent(facilis.AbstractElement.ELEMENT_OVER,event);
    };
    
    element.onMouseOut = function (event) {
        event.stopPropagation();
        this.dispatchMouseEvent(facilis.AbstractElement.ELEMENT_OUT,event);
    };
    
    element.onDoubleClick = function (event) {
        event.stopPropagation();
        this.dispatchMouseEvent(facilis.AbstractElement.ELEMENT_DOUBLE_CLICKED,event);
    };
    
    element.dispatchMouseEvent=function(name,evt){
        var event=new facilis.Event(name);
        event.x=evt.rawX;
        event.y=evt.rawY;
        event.localX=evt.rawX;
        event.localY=evt.rawY;
        event.stageX=evt.stageX;
        event.stageY=evt.stageY;
        
        this.dispatchEvent(event);
    }
    
    element.removeMe=function() {
        if(!this._removed){
            /*var removeMe = function() {
                this.parent.removeChild(this);
            }
            if(this.width>View.getInstance().getStageWidth() || this.height>View.getInstance().getStageHeight()){*/
                this.parent.removeChild(this);
            /*}else {
                Tweener.addTween(this, { alpha:0, time:.5, transition:"easeInOutBounce", onComplete:removeMe } );
            }*/
        }
    }
    
    element.select=function() {
        this._selected = true;
        this.shadow = new facilis.Shadow("#00FF00", 0, 0, 15);
        
        this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_SELECTED));
    }

    element.unselect=function() {
        if (this._selected) {
            this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_UNSELECTED));
        }
        this._selected = false;
        this.shadow = null;
        /*this.filters = [];
        var b=this.getBounds();
        //this.cache(-10, -10, 100, 100);*/
    }
    
    element.appear=function() {
        //this.alpha = 0;
        //Tweener.addTween(this, { alpha:1, time:0, transition:"easeOutInBounce"} );
        //facilis.Tween.get(this, {override:true}).to({ alpha: 1 }/*, 1000, facilis.Ease.getPowInOut(4) );*/
    }

    element.LocalhitTest=function(x,y){
        if(this.hitTest(x,y))
            return true;
        
        var p={};
        for (var i = 0; i < this.numChildren;i++ ) {
            var el = this.getChildAt(i);
            el.globalToLocal(x,y,p);
            if(el.hitTest(p.x,p.y))
                return true;
        }
        return false;
    }
    
    element.hitTestMe=function(e) {

    }
    
    element.hitTestObject=function(el){
		function getCoords(el){
			return {
				x:((el instanceof facilis.Element)?(el.x+el._sizableElement.x):el.x),
				y:((el instanceof facilis.Element)?(el.y+el._sizableElement.y):el.y)
			}
		}
		var x1=getCoords(this).x;
		var y1=getCoords(this).y;
		var w1=this._width;
		var h1=this._height;
		
		var x2=getCoords(el).x;
		var y2=getCoords(el).y;
		var w2=el._width;
		var h2=el._height;
		
		return (x1 <= x2+w2 &&
          x2 <= x1+w1 &&
          y1 <= y2+h2 &&
          y2 <= y1+h1);
		
    }
    
    element.hitTestBase=element.hitTest;
    
    element.hitTest=function(x,y){
        return this.hitTestBase(x,y);
    }

    element.removeEventListeners=function(type) {
        this.removeAllEventListeners(type);
    }
    
    element.removeAllEventListenersFrom=function(eventType) {
        this.removeAllEventListeners(eventType);
    }
    
    facilis.AbstractElement = facilis.promote(AbstractElement, "BaseElement");
    
}());