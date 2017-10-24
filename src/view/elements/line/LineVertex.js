(function() {

    function LineVertex() {
		this.BaseElement_constructor();
        
        this.lastElement=new facilis.BaseElement();
		this.nextElement=new facilis.BaseElement();
		
		this.lastClick=0;
		
		this.__allowMoving = false;
		this.__wasMoving = false;
		this.mouseListener={};

        this.cacheThreshold=20;
        
        this.vertex_size=24;
        
        this.vertex;
        
        this.setup();
    }
    
    LineVertex.CLICK					 = "onVertexClick";
    LineVertex.MOVED					 = "onVertexMoved";
    LineVertex.DROP						 = "onVertexDrop";
    LineVertex.START_MOVE				 = "onVertexStartMove";
    LineVertex.CLICKED					 = "onVertexClicked";
    LineVertex.DOUBLE_CLICKED			 = "onVertexDoubleClicked";
    LineVertex.OVER						 = "onVertexRollOver";
    LineVertex.OUT						 = "onVertexRollOut";
    LineVertex.DELETED					 = "onVertexDeleted";
    
    
    var element = facilis.extend(LineVertex, facilis.Drag);
    
    /*
        element.BaseClassSetup=element.setup;
    */
    
    element.DragSetup=element.setup;
    element.setup = function() {
        this.DragSetup();
        
        this.vertex=new facilis.BaseElement();
        this.addChild(this.vertex);
        
        this.vertex.graphics = new facilis.Graphics();
        this.vertex.graphics.beginFill("rgba(230,230,230,0.1)");//beginFill("#EEEEEE",.1);			
        this.vertex.graphics.drawCircle(this.vertex_size,this.vertex_size, this.vertex_size);
        this.vertex.graphics.endFill();
        this.vertex.graphics.lineStyle(1,"#000000");
        this.vertex.graphics.beginFill("#999999");			
        this.vertex.graphics.drawCircle( this.vertex_size, this.vertex_size, this.vertex_size/8);
        this.vertex.graphics.endFill();
        this.vertex.addShape(new facilis.Shape(this.vertex.graphics));
        
        this.addEventListener(facilis.Drag.DRAG_EVENT, this.onVertexMove.bind(this));
        this.addEventListener(facilis.Drag.STOP_EVENT, this.onRelease.bind(this));
        this.addEventListener(facilis.AbstractElement.ELEMENT_OVER, this.onRollOver.bind(this));
        this.addEventListener(facilis.AbstractElement.ELEMENT_OUT, this.onRollOut.bind(this));
        this.addEventListener(facilis.AbstractElement.ELEMENT_CLICKED, this.onClick.bind(this));
        this.addEventListener(facilis.AbstractElement.ELEMENT_DOUBLE_CLICKED, this.onDoubleClick.bind(this));
        //this.setCached(true);
        this.vertex.x=-this.vertex_size;
        this.vertex.y=-this.vertex_size;
        
        //this.vertex.cache(-this.cacheThreshold-this.vertex_size,-this.cacheThreshold-this.vertex_size,this.cacheThreshold+this.vertex_size,this.cacheThreshold+this.vertex_size);
        this.vertex.cache(-this.cacheThreshold,-this.cacheThreshold,this.cacheThreshold+this.vertex_size+50,this.cacheThreshold+this.vertex_size+50);
        this.tickChildren=false;
    };
    
    element.onRelease=function(evt) {
        this.dispatchEvent(new facilis.Event(facilis.LineVertex.MOVED));
        this.removeEventListener(facilis.Drag.DRAG_EVENT, this.onVertexMove);
        if (this.__wasMoving) {
            this.__wasMoving = false;
            this.dispatchEvent(new facilis.Event(facilis.LineVertex.DROP));
        }
        this.__allowMoving = false;
        
    }
    
    element.onDoubleClick=function(evt){
        this.dispatchEvent(new facilis.Event(facilis.LineVertex.DOUBLE_CLICKED));
    }
    
    element.onClick=function(evt){
        this.dispatchEvent(new facilis.Event(facilis.LineVertex.CLICKED));
    }

    element.onVertexMove=function(evt) {
		evt.stopImmediatePropagation();
        /*var xmouse = 0; var ymouse = 0;
        var p:Point = new Point(xmouse,ymouse);
        parent.globalToLocal(p);
        this.x =  Math.round(p.x);
        this.y =  Math.round(p.y);*/
        if (!this.__wasMoving) {
            this.dispatchEvent(new facilis.Event(facilis.LineVertex.START_MOVE));
            this.__wasMoving = true;
        }
        this.__allowMoving = true;
        this.dispatchEvent(new facilis.Event(facilis.LineVertex.MOVED));
        //evt.updateAfterEvent();
    }

    element.onRollOver=function(evt){
        var pos =new facilis.Point();
        pos.x=evt.stageX;
        pos.y=evt.stageY;
        //_parent.globalToLocal(pos);
        /*mouseListener=new Object();
        var tmp=this; 
        stage.addEventListener(.onMouseMove=function(evt){
            var pos:Point = new Point( evt.stageX ,evt.stageY );
            tmp.dispatchEvent(new facilis.Event("onVertexRollOver"));
        }

        Mouse.addListener(mouseListener);*/
        /*this.graphics.clear();
        this.graphics.lineStyle(1, 0x000000); 
        this.graphics.beginFill(0x999999, .6);  
        this.graphics.drawCircle(0, 0, 9);
        this.graphics.endFill(); */

        this.dispatchEvent(new facilis.Event(facilis.LineVertex.OVER));
        /*var fGlow:GlowFilter = new GlowFilter(0x7aff43,.5,2,2,5,3,false,false);
        this.filters=[fGlow];*/
    }

    element.onRollOut=function(evt) {
        /*this.graphics.clear();
        this.graphics.lineStyle(0, 0x000000,0); 
        this.graphics.beginFill(0x999999, 0); 
        this.graphics.drawCircle(0, 0, 6);
        this.graphics.endFill(); 
        this.graphics.lineStyle(1, 0x000000); 
        this.graphics.beginFill(0x999999, 1); 
        this.graphics.drawCircle(0, 0, 4);
        this.graphics.endFill(); */
        //this.filters=[];
        //Mouse.removeListener(mouseListener);
        this.dispatchEvent(new facilis.Event(facilis.LineVertex.OUT));
    }

    element.remove=function(){
        this.dispatchEvent(new facilis.Event(facilis.LineVertex.DELETED));
        this.removeAllEventListeners();
        //this.parent.removeChild(this);
        this.removeMe();
    }

    element.setLastElement=function(el){
        this.lastElement=el;
    }

    element.setNextElement=function(el){
        this.nextElement=el;
    }

    element.getLastElement=function(){
        return this.lastElement;
    }

    element.getNextElement=function(){
        return this.nextElement;
    }
    
    element.getIntersectionWidthSegment=function(start,end){
       
        var p=new facilis.Point(this.x,this.y);
        var size=5;
        
        //this.localToGlobal(0,0,p);
        
        var numberOfSides = 5;
        var Xcenter = p.x;
        var Ycenter = p.y;

        var p1=new facilis.Point(Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));
        var p2;
        var lines=[];
        for (var i = 1; i <= numberOfSides;i += 1) {
            p2=new facilis.Point(Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
            if(this.FindPointofIntersection(start,end,p1,p2)) {
             //console.log("not failed linevertex intersection segment");
                return this.FindPointofIntersection(start,end,p1,p2);
            }
            
            p1=p2;
        }
        
        //if(ret){
        //    this.localToGlobal(ret.x,ret.y,ret);
        //}else{
            //console.log("failed linevertex intersection segment");
        //}
        
        return null;
        
        
    }
    


    facilis.LineVertex = facilis.promote(LineVertex, "Drag");
    
}());