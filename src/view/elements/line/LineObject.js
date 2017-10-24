(function() {

    function LineObject(s,e) {
        
        if(!s && !e)
            throw Error("Start and End elements can not be null");
        
        this.BaseElement_constructor();
        
        this.m_endPoint=0;
		this.m_startPoint=0;
		this.m_startElementMc=s;	
		this.m_endElementMc=e;
        
        this._elementId=null;
        
        this.NAME_FONT_FACE = "k0554";
		this.NAME_FONT_COLOR = "#333333";
		this.NAME_FONT_SIZE = "8";
		this.NAME_BG_COLOR = "#DFDFDF";
		this.NAME_BORDER_COLOR = "#CCCCCC";
		
		this.showForth = true;
		this.showBack = false;
		
		this._doubleArrow = false;
		
		
		this.startDragging = false;
		this.endDragging = false;
		
		this.isLooped_back=false;
		this.loop_mc=null;
		
		this.__conditionmc=null;
		this.__namemc=null;
		this.__wizmc=null;
		
		this.lineMC=null;
		this.vertexMC=null;
		this.arrowMC=null;
		this.arrowBackMC=null;
		
		this.lineCornersMC=null;
		
		this.startVertex=null;
		this.endVertex=null;
		
		this.lineVertexs=[];
		this.lineSegments=[];
		
		
		this.lastClick=0;
		this.dblClickSpeed=400;
		
		this.justDblClicked=false;
		
		this.isWizard = false;
		
		this.type = "";
		
		this.middlePoint=null;
		
		this.initIcon=null;
		
        
        this.data=null;
		
		this.txtName=null;
		
		this.FONT_COLOR = "#333333";
		this.FONT_SIZE = "10";
		this.FONT_FACE = "Tahoma";
		
        
        
        
        this.setup();
    }
    
    LineObject.VERTEXES_CHANGED          = "onVertexesChanged";
    LineObject.VERTEXES_TO_CHANGE        = "onVertexesToChange";
    LineObject.lineColor                 = "#A4A4A4";
    LineObject.lineWidth                 = 1.5;
    LineObject.VERTEX_ADD_ENABLE 		 = true;
    
    var element = facilis.extend(LineObject, facilis.AbstractElement);

    element.AbstractElementSetup=element.setup;
    element.setup = function() {
        this.AbstractElementSetup();
        
        
        
        this.startVertex=null;
        this.endVertex = null;
        this.m_endElementMc.addEventListener(facilis.AbstractElement.ELEMENT_MOVED,this.onElementMoved.bind(this));
        this.m_startElementMc.addEventListener(facilis.AbstractElement.ELEMENT_MOVED,this.onElementMoved.bind(this));
        this.m_endElementMc.addEventListener(facilis.AbstractElement.ELEMENT_DELETE,this.onElementDeleted.bind(this));
        this.m_startElementMc.addEventListener(facilis.AbstractElement.ELEMENT_DELETE, this.onElementDeleted.bind(this));

		this.m_startElementMc.addEventListener(facilis.AbstractElement.ELEMENT_DRAGGED,this.onElementMoved.bind(this));
        this.m_endElementMc.addEventListener(facilis.AbstractElement.ELEMENT_DRAGGED,this.onElementMoved.bind(this));
		
		this.m_endElementMc.addEventListener(facilis.AbstractElement.ELEMENT_DRAG,this.onElementDragged.bind(this));
        this.m_startElementMc.addEventListener(facilis.AbstractElement.ELEMENT_DRAG, this.onElementDragged.bind(this));

        this.m_endElementMc.addEventListener(facilis.Drag.STOP_EVENT, this.onElementDrop.bind(this));
        this.m_startElementMc.addEventListener(facilis.Drag.STOP_EVENT, this.onElementDrop.bind(this));
        this.m_endElementMc.addEventListener(facilis.Drag.RESET_EVENT, this.onElementDrop.bind(this));
        this.m_startElementMc.addEventListener(facilis.Drag.RESET_EVENT, this.onElementDrop.bind(this));

        this.addEventListener(facilis.AbstractElement.ELEMENT_OVER, this.onLineOver.bind(this));
        this.addEventListener(facilis.AbstractElement.ELEMENT_OUT, this.onLineOut.bind(this));
        
        this.addEventListener(facilis.AbstractElement.ELEMENT_DOUBLE_CLICKED, this.onLineDoubleClick.bind(this));

        this.lineMC = new facilis.BaseElement();
        this.addChild(this.lineMC);
        this.lineCornersMC = new facilis.BaseElement();
        this.addChild(this.lineCornersMC);
        this.vertexMC = new facilis.BaseElement();
        this.addChild(this.vertexMC);
        this.vertexMC.alpha = 0;

        this.setLineEvents();
        this.addSegment(this.m_startElementMc, this.m_endElementMc);

        this.txtName = new facilis.ElementText();
        /*txtName.autoSize = TextFieldAutoSize.CENTER;
        txtName.selectable = false;
        txtName.multiline = true;
        txtName.wordWrap = true;
        txtName.width = 1;*/

        /*var myformat:TextFormat = new TextFormat();
        myformat.color = FONT_COLOR;
        myformat.size = FONT_SIZE;
        myformat.font = FONT_FACE;
        myformat.align = "center";
        txtName.defaultTextFormat=myformat;*/

        //txtName.height = 1;

        /*txtName.addEventListener("mouseover", function(evt) {
            evt.currentTarget.parent.parent.dispatchEvent(evt);
        });*/

        this.addChild(this.txtName);

        this.refreshWholeLine();

        this.initIcon = new facilis.BaseElement();
        this.addChild(this.initIcon);
        var e=new facilis.Event(facilis.AbstractElement.ELEMENT_MOVED);
        e.target=this.m_endElementMc;
        this.m_endElementMc.dispatchEvent(e);

        
    };
    
    
    
    
    element.onLineDoubleClick=function(evt) {
        var seg=null;
        for (var i = 0; i < this.lineMC.numChildren ; i++ ) {
            var child= this.lineMC.getChildAt(i);
            //if(child.hitTestPoint(evt.localX,evt.localY,true)){
            if(child.hitTest(evt.stageX,evt.stageY)){
                seg=this.lineMC.getChildAt(i);
                break;
            }
        }
        if(seg){
            this.addVertex(seg.getStartElement(),seg.getEndElement(),evt.localX,evt.localY);
        }
    }

    element.setLineEvents=function(){
        var tmp = this;
        this.lineMC.addEventListener("mouseup"  , function(evt) {
            var timer = getTimer();
            if (((timer - tmp.lastClick) < tmp.dblClickSpeed) && LineObject.VERTEX_ADD_ENABLE) {
                tmp.justDblClicked=true;
                tmp.onLineDoubleClick(evt);
            }
            tmp.lastClick=timer;
        });
    }

    element.remove=function() {
        callStartEndFunctions("remove");
        try{
            this.getEndElement().getElement().setFirstTask("false");
        }catch(e){
        }
        this.m_startElementMc.removeEventListener(AbstractElement.ELEMENT_DELETE, this.onElementDeleted);
        this.m_endElementMc.removeEventListener(AbstractElement.ELEMENT_DELETE,this.onElementDeleted);
        this.m_endElementMc.removeEventListener(AbstractElement.ELEMENT_MOVED,this.onElementMoved);
        this.m_startElementMc.removeEventListener(AbstractElement.ELEMENT_MOVED, this.onElementMoved);
        this.m_endElementMc.removeEventListener(AbstractElement.ELEMENT_DRAG,this.onElementDragged);
        this.m_startElementMc.removeEventListener(AbstractElement.ELEMENT_DRAG, this.onElementDragged);
		
		this.m_endElementMc.removeEventListener(AbstractElement.ELEMENT_DRAGGED,this.onElementMoved);
        this.m_startElementMc.removeEventListener(AbstractElement.ELEMENT_DRAGGED, this.onElementMoved);

        this.m_endElementMc.removeEventListener(Drag.STOP_EVENT, this.onElementDrop);
        this.m_startElementMc.removeEventListener(Drag.STOP_EVENT, this.onElementDrop);
        this.m_endElementMc.removeEventListener(Drag.RESET_EVENT, this.onElementDrop);
        this.m_startElementMc.removeEventListener(Drag.RESET_EVENT, this.onElementDrop);

        if (middlePoint) {
            middlePoint.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DELETE));
        }
        this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DELETE));

        View.getInstance().getLineView().removeElement(this);
    }

    element.addVertex=function(startEl, endEl, x, y) {
        var depth = this.numChildren;
        this.dispatchEvent(new facilis.Event(LineObject.VERTEXES_TO_CHANGE));
        var lineVertex = new facilis.LineVertex();
        this.vertexMC.addChild(lineVertex);
        lineVertex.x = x;
        lineVertex.y = y;
        lineVertex.addEventListener(facilis.LineVertex.CLICK,this.onVertexClick.bind(this));
        lineVertex.addEventListener(facilis.LineVertex.MOVED, this.onVertexMoved.bind(this));
        lineVertex.addEventListener(facilis.LineVertex.DROP, this.onVertexDrop.bind(this));
        lineVertex.addEventListener(facilis.LineVertex.START_MOVE, this.onVertexStartMove.bind(this));
        lineVertex.addEventListener(facilis.LineVertex.CLICKED,this.onVertexClicked.bind(this));
        lineVertex.addEventListener(facilis.LineVertex.DOUBLE_CLICKED,this.onVertexDoubleClicked.bind(this));
        lineVertex.addEventListener(facilis.LineVertex.OVER,this.onVertexRollOver.bind(this));
        lineVertex.addEventListener(facilis.LineVertex.OUT, this.onVertexRollOut.bind(this));

        if(startEl!=this.m_startElementMc){
            startEl.setNextElement(lineVertex);
        }else{
            this.startVertex=lineVertex;
        }

        if(endEl!=this.m_endElementMc){
            endEl.setLastElement(lineVertex);
        }else{
            this.endVertex=lineVertex;
        }

        lineVertex.setLastElement(startEl);
        lineVertex.setNextElement(endEl);
        this.lineVertexs.push(lineVertex);
        
        var seg = this.getSegment(startEl, endEl);

        seg.setEndElement(lineVertex);
        this.addSegment(lineVertex,endEl);
        this.refreshWholeLine();
        this.dispatchEvent(new facilis.Event(facilis.LineObject.VERTEXES_CHANGED));
        return lineVertex;
    }

    element.removeVertex=function(vertex){
        for(var i=0;i<this.lineVertexs.length;i++){
            if (this.lineVertexs[i] == vertex) {
                this.dispatchEvent(new facilis.Event(LineObject.VERTEXES_TO_CHANGE));
                if(this.startVertex==vertex){
                    this.startVertex=(vertex.getNextElement() && vertex.getNextElement()!=this.m_endElementMc)?vertex.getNextElement():null;
                }
                if(this.endVertex==vertex){
                    this.endVertex=(vertex.getLastElement() && vertex.getLastElement()!=this.m_startElementMc)?vertex.getLastElement():null;
                }
                var segment = this.getSegment(vertex, vertex.getNextElement());
                this.removeSegment(segment);
                segment=this.getSegment(vertex.getLastElement(),vertex);
                segment.setEndElement(vertex.getNextElement());
                if(vertex.getLastElement()!=this.m_startElementMc){
                    vertex.getLastElement().setNextElement(vertex.getNextElement());
                }
                if(vertex.getNextElement()!=this.m_endElementMc){
                    vertex.getNextElement().setLastElement(vertex.getLastElement());
                }
                this.lineVertexs.splice(i,1);
                vertex.remove();
                this.refreshWholeLine();
                this.dispatchEvent(new facilis.Event(LineObject.VERTEXES_CHANGED));
            }
        }
    }

    element.removeSegment=function(segment){
        for (var i = 0; i < this.lineMC.numChildren;i++ ) {
            var seg=this.lineMC.getChildAt(i);
            if(seg==segment){
                this.lineSegments.splice(i,1);
                segment.remove();
            }
        }

    }

    element.onVertexClick=function(eventObj) {
        var vertex = eventObj.target;
    }

    element.onVertexMoved=function(eventObj)  {
		eventObj.stopImmediatePropagation();
        startDragging = false;
        endDragging = false;
        var vertex = eventObj.target;
        this.refreshWholeLine(false);
    }

    element.onVertexDrop=function(eventObj)  {
        var vertex = eventObj.target;
        if(vertex.movedX!=0 || vertex.movedY!=0){
            this.dispatchEvent(new facilis.Event(LineObject.VERTEXES_CHANGED));
        }
    }

    element.onVertexStartMove=function(eventObj)  {
		eventObj.stopImmediatePropagation();
        //var vertex:LineVertex = eventObj.target as LineVertex;
        this.dispatchEvent(new facilis.Event(LineObject.VERTEXES_TO_CHANGE));
    }

    element.onVertexClicked=function(eventObj) {
        var vertex = eventObj.target;
    }

    element.onVertexRollOver=function(eventObj) {
        var vertex = eventObj.target;
        vertex.alpha = .9;
    }

    element.onVertexRollOut=function(eventObj) {
        var vertex = eventObj.target;
        vertex.alpha = .3;
    }

    element.onVertexDoubleClicked=function(eventObj) {
        var vertex = eventObj.target;
        this.removeVertex(vertex);
    }

    element.refreshWholeLine=function(_acc) {
        _acc=(_acc===false)?false:true;
		/*this.x=0;
		this.y=0;*/
        this.moveVertexes();
        for (var i = 0; i < this.lineMC.numChildren;i++ ) {
            var seg = this.lineMC.getChildAt(i);
            seg.setType(this.type);
            seg.updateSegment(_acc);
        }
        this.setArrow();
        this.updateArrowPos();
        //this.updateInitIconPos();
        this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_MOVED));
        if (this.middlePoint) {
            var p = this.getMiddlePoint();
            this.middlePoint.x = p.x;
            this.middlePoint.y = p.y;
            this.middlePoint.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_MOVED));
        }
        this.alignText();
        /*try {
        if ((this.m_startElementMc).selected && (this.m_endElementMc).selected) {
            i = 0;
            for (i = 0; i < lineVertexs.length;i++ ) {
                (lineVertexs[i] ).moveX((this.m_startElementMc ).movedX);
                (lineVertexs[i] ).moveY((this.m_startElementMc ).movedY);
            }
        }
        }catch(e){}*/
            //(new Solver()).solve(this.m_startElementMc,this.m_endElementMc);
            this.updateLineCorners();
    }
	
	element.moveWholeLine=function() {
		this.moveVertexes();
		this.x=this.m_startElementMc.movedX;
		this.y=this.m_startElementMc.movedY;
    }

    element.moveVertexes=function() {
        if (this.startDragging && this.endDragging) {
            for (var i = 0; i < this.lineVertexs.length; i++) {
                this.lineVertexs[i].moveX((this.m_startElementMc).movedX);
                this.lineVertexs[i].moveY((this.m_startElementMc).movedY);
            }
        }
    }

    element.addSegment=function(startEl,endEl){
        var depth=this.lineMC.numChildren+10;
        //var segment=this.lineMC.attachMovie("LineSegment",("lineSegment_"+depth),depth,{startPoint:startEl,endPoint:endEl});
        var segment = new facilis.LineSegment(startEl, endEl);
        this.lineMC.addChild(segment);
        //segment.addEventListener("onSegmentDocubleClicked",onSegmentDocubleClicked);
        this.lineSegments.push(segment);
    }

    element.getSegment=function(startEl,endEl){
        var seg = null;
        for (var i = 0; i < this.lineMC.numChildren; i++ ) {
            seg = this.lineMC.getChildAt(i) ;
            if(!(seg.getStartElement()==startEl && seg.getEndElement()==endEl)){
                seg = null;
            }else {
                return seg;
            }
        }
        return seg;
    }

    element.getSegments=function() {
        var segs = [];
        for (var i = 0; i < this.lineMC.numChildren; i++ ) {
            segs.push(this.lineMC.getChildAt(i));
        }
        return segs;
    }

    element._cached=false;
    element.onElementMoved=function(evt) {
        if(this._cached){
            this._cached=false;
            this.uncacheSegments();
        }

        if (evt.target == this.m_startElementMc) {
            this.startDragging = true;
        }
        if (evt.target == this.m_endElementMc) {
            this.endDragging = true;
        }
        this.refreshWholeLine(false);
    }
	
	element.onElementDragged=function(evt) {
        if (evt.target == this.m_startElementMc) {
            this.startDragging = true;
        }
        if (evt.target == this.m_endElementMc) {
            this.endDragging = true;
        }
		if(this.endDragging && this.startDragging){
        	this.moveWholeLine();
		}else{
			this.refreshWholeLine(false);
		}
    }

    element.onElementDrop=function(evt) {
        if (evt.target == this.m_startElementMc) {
            this.startDragging = false;
        }
        if (evt.target == this.m_endElementMc) {
            this.endDragging = false;
        }
        this.refreshWholeLine();
        
        if (!this.startDragging || !this.endDragging) {
            for (var i = 0; i < this.lineVertexs.length; i++) {
                (this.lineVertexs[i] ).resetStart();
            }
        }
        if(!this._cached){
            this._cached=true;
            this.cacheSegments();
        }
    }
    
    element.uncacheSegments=function(){
        /*for(var i=0;i<this.lineSegments.length;i++)
            this.lineSegments[i].uncacheSegment();*/
    }
    
    element.cacheSegments=function(){
        /*for(var i=0;i<this.lineSegments.length;i++)
            this.lineSegments[i].cacheSegment();*/
    }

    element.onElementDeleted=function(e) {
        this.remove();
    }

    element.setArrow=function() {
        if (this.arrowMC != null) {
		//if (this.arrowMC != null && this.showBack) {
            this.removeChild(this.arrowMC);
            this.arrowMC = null;
        }
        if (this.showForth) {
		//if (this.showForth && !this.arrowMC) {
            this.arrowMC = new facilis.BaseElement();
            this.addChild(this.arrowMC);
        }
        if (this.arrowBackMC != null) {
		//if (this.arrowBackMC != null && this.showForth) {
            this.removeChild(this.arrowBackMC);
            this.arrowBackMC = null;
        }
        if (this.showBack) {
		//if (this.showBack && !this.arrowBackMC) {
            this.arrowBackMC = new facilis.BaseElement();
            this.addChild(this.arrowBackMC);
        }
		
		//if (this.arrowMC || this.arrowBackMC)
        	this.createArrow(0,0);
			
        /*if(isWizard){
            createArrow(0,15);
        }*/
        this.vertexMC.parent.setChildIndex(this.vertexMC, this.vertexMC.parent.numChildren - 1);

    }

    element.createArrow=function(x, y) {
        if (this.showForth) {
            this.drawArrow(this.arrowMC, x, y);
            if (this._doubleArrow) {
                this.drawArrow(this.arrowMC, x, y-8);
            }
        }
        if (this.showBack) {
            this.drawArrow(this.arrowBackMC, x, y);
            if (this._doubleArrow) {
                this.drawArrow(this.arrowBackMC, x, y-8);
            }
        }
    }

    element.drawArrow=function(mc,x,y) {
        var size = 10;
        if(!mc.graphics)
            mc.graphics = new facilis.Graphics();
        
        mc.removeAllChildren();
        mc.graphics.lineStyle(0.25,LineObject.lineColor,1);
        mc.graphics.beginFill("#CCCCCC",100);
        mc.graphics.moveTo(x,y);
        mc.graphics.lineTo((size+x),-(size-y));
        mc.graphics.lineTo(0,-(size-y));
        mc.graphics.lineTo(-(size+x),-(size-y));
        mc.graphics.lineTo(x,y);
        mc.graphics.endFill();
        mc.addShape(new facilis.Shape(mc.graphics));
    }

    element.getLastSegment=function(){
        for(var i in this.lineMC){
            var seg=this.lineMC[i];
            if(seg.getEndElement()==this.m_endElementMc){
                return seg;
            }
        }
        return null;
    }

    element.updateArrowPos=function() {
        if(this.showForth){
            this.updateForthArrowPos();
        }
        if(this.showBack){
            this.updateBackArrowPos();
        }
    }

    element.updateForthArrowPos=function() {
        var lastVertex = (this.endVertex)?this.endVertex:this.m_startElementMc;
        var ePoint = new facilis.Point(this.m_endElementMc.x, this.m_endElementMc.y  );
        if (!this.parent) {
            return;
        }
        this.m_endElementMc.parent.localToGlobal( ePoint.x,ePoint.y,ePoint  )
        this.parent.globalToLocal( ePoint.x,ePoint.y,ePoint   );
        var sPoint = new facilis.Point(lastVertex.x, lastVertex.y  );
        lastVertex.parent.localToGlobal( sPoint.x,sPoint.y,sPoint  )
        this.parent.globalToLocal(  sPoint.x,sPoint.y,sPoint  );
        var sin=ePoint.x-sPoint.x;
        var cos=ePoint.y-sPoint.y;

        var angle=-(Math.atan2(sin,cos)*(180/Math.PI));
        this.arrowMC.rotation = angle;
        var s = this.getSegmentEnding(this.m_endElementMc);
        var point = s.getEndPoint();
        s.parent.localToGlobal(point.x,point.y,point);
        this.m_endElementMc.parent.globalToLocal(point.x,point.y,point);
        this.x = 0;
        this.y = 0;
        this.arrowMC.x=point.x;
        this.arrowMC.y=point.y;
    }

    element.updateBackArrowPos=function() {
        var firstVertex = (this.startVertex)?this.startVertex:this.m_endElementMc;
        var sPoint = new facilis.Point(this.m_startElementMc.x, this.m_startElementMc.y  );
        if (!this.parent) {
            return;
        }
        this.m_startElementMc.parent.localToGlobal( sPoint.x,sPoint.y,sPoint  )
        this.parent.globalToLocal(  sPoint.x,sPoint.y,sPoint  );
        var ePoint = new facilis.Point(firstVertex.x, firstVertex.y  );
        
        firstVertex.parent.localToGlobal( ePoint.x,ePoint.y,ePoint  )
        this.parent.globalToLocal(  ePoint.x,ePoint.y,ePoint  );
        var sin=sPoint.x-ePoint.x;
        var cos=sPoint.y-ePoint.y;

        var angle=-(Math.atan2(sin,cos)*(180/Math.PI));
        this.arrowBackMC.rotation = angle;
        var s = this.getSegmentStarting(this.m_startElementMc);
        var point = s.getStartPoint();
        s.parent.localToGlobal(point.x,point.y,point);
        this.m_endElementMc.parent.globalToLocal(point.x,point.y,point);
        this.x = 0;
        this.y = 0;
        this.arrowBackMC.x = point.x;
        this.arrowBackMC.y = point.y;
    }

    element.updateInitIconPos=function(){
        var firstVertex = (this.startVertex)?this.startVertex:this.m_endElementMc;
        var sPoint = new facilis.Point(this.m_startElementMc.x, this.m_startElementMc.y  );
        if (!this.parent) {
            return;
        }
        
        sPoint = this.parent.globalToLocal(  this.m_startElementMc.parent.localToGlobal( sPoint  )  );
        var ePoint = new facilis.Point(firstVertex.x, firstVertex.y  );
        ePoint = this.parent.globalToLocal(  firstVertex.parent.localToGlobal( ePoint  )  );
        
        var point = null;
        if(this.m_startElementMc.getIntersectionWidthSegment){
            point=this.m_startElementMc.getIntersectionWidthSegment(sPoint,ePoint);
        }
        
        if(!point){
            var sin=sPoint.x-ePoint.x;
            var cos=sPoint.y-ePoint.y;

            var angle=-(Math.atan2(sin,cos)*(180/Math.PI));
            this.initIcon.rotation = angle;
            var dist = 0;
            point = new facilis.Point((sPoint.x + ( Math.cos((angle - 90) * (Math.PI / 180)) * dist )), ( sPoint.y + ( Math.sin((angle - 90) * (Math.PI / 180)) * dist ) ));
            point = this.m_startElementMc.parent.localToGlobal(point.x,point.y,point);


            while ( this.m_startElementMc.hitTest( point.x , point.y) ) {
                dist += 3;
                point = new facilis.Point((sPoint.x + ( Math.cos((angle - 90) * (Math.PI / 180)) * dist )), ( sPoint.y + ( Math.sin((angle - 90) * (Math.PI / 180)) * dist ) ));
                this.m_startElementMc.parent.localToGlobal(point.x,point.y,point);
            }
        }
        this.m_endElementMc.parent.globalToLocal(point.x,point.y,point);
        this.initIcon.x=point.x;
        this.initIcon.y=point.y;
    }

    element.getMiddlePoint=function() {
        this.x = 0;
        this.y = 0;
        var distance=0;
        for (var i = 0; i < this.lineMC.numChildren;i++ ) {
            var lineLenght = (this.lineMC.getChildAt(i)  ).getLength();
            if(lineLenght){
                distance+=lineLenght;
            }
        }
        var half=distance/2;
        distance = 0;
        var length=half;
        var seg = null;
        if(this.lineVertexs.length==0){
            seg=this.getSegment(this.m_startElementMc,this.m_endElementMc);
        }else {
            var s=this.m_startElementMc;
            var e=this.startVertex;
            while (e) {
                var aux = this.getSegment(s, e);
                if (aux) {
                    seg = aux;
                    lineLenght = seg.getLength();
                    //var className = ((Object(s).constructor) as Class);
                    if ( (distance < half && distance + lineLenght >= half) 
                    
                    /*|| (className + "" == "[class Element]")*/
                    
                    ) {
                        length=half-distance;
                        e=null;
                        break;
                    }else {
                        distance+=lineLenght;
                        s = e;
                        e = (s.getNextElement)?s.getNextElement():null;
                    }
                }else {
                    e = null;
                }
            }
        }
        return seg.getSegmentPoint(length);

    }

    element.getVertexData=function(){
        var data="";
        var e=this.startVertex;
        while(e){
            data+=e.x+";"+e.y;
            e=e.getNextElement();
            if(e!=this.m_endElementMc){
                data+="-";
            }else{
                e=null;
            }
        }
        return data;
    }

    element.setVertexData=function(data) {
        while (this.vertexMC.numChildren > 0) {
            this.removeVertex(this.vertexMC.getChildAt(0));
        }
        if(data!=""){
            var vertexes=data.split("-");
            var x=vertexes[0].split(";")[0];
            var y=vertexes[0].split(";")[1];
            this.addVertex(this.m_startElementMc,this.m_endElementMc,x,y);
            var vert=this.startVertex;
            for(var i=1;i<vertexes.length;i++){
                x=vertexes[i].split(";")[0];
                y=vertexes[i].split(";")[1];
                this.addVertex(vert,this.m_endElementMc,x,y);
                vert=vert.getNextElement();
            }
        }
    }

    element.overrideVertexData=function(data){
        var vertexes=data.split("-");
        for(var i=0;i<vertexes.length;i++){
            var x = vertexes[i].split(";")[0];
            var y = vertexes[i].split(";")[1];
            if(this.lineVertexs[i]){
                this.lineVertexs[i].x = x;
                this.lineVertexs[i].y = y;
            }
        }
        this.refreshWholeLine();
    }

    element.setType=function(t) {
        this.type = t;
        this.m_endElementMc.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_MOVED));
    }

    element.conditionChange=function(type) {
        this.initIcon.graphics.clear();
        if (type=="OTHERWISE") {
            this.initIcon.graphics.lineStyle(2, facilis.LineObject.lineColor);
            this.initIcon.graphics.moveTo( -5, -15);
            this.initIcon.graphics.lineTo(5, -5);
        }else if (type == "CONDITION") {
            var st = (this.m_startElementMc);
            if (st.elementType != "gateway") {
                this.initIcon.graphics.beginFill(0xFFFFFF, .9);
                this.initIcon.graphics.lineStyle(1, facilis.LineObject.lineColor);
                this.initIcon.graphics.moveTo( -7, -10);
                this.initIcon.graphics.lineTo(0, -15);
                this.initIcon.graphics.lineTo(7, -10);
                this.initIcon.graphics.lineTo(0, -5);
                this.initIcon.graphics.lineTo( -7, -10);
                this.initIcon.graphics.endFill();
            }
        }
    }

    element.setCircle=function() {
        this.initIcon.graphics.beginFill(0xFFFFFF, .9);
        this.initIcon.graphics.lineStyle(1, facilis.LineObject.lineColor);
        this.initIcon.graphics.drawCircle(0, -5, -5);
        this.initIcon.graphics.endFill();
    }

    element.setData=function(d) {
		if(d.setViewModel && !this.setModel){
			d.setViewModel(this);
			this.setModel(d);
			d.updateAllBindings();
		}
        this.data = d;
    }

    element.getData=function() {
        if (!this.data && this.elementType) {
            this.data = (facilis.ElementAttributeController.getInstance().getElementModel( this.elementType )).cloneNode(true);
            this.data.id = this.id;
        }
        this.getExtremeIds();
        this.getVertexs();
        return this.data;
    }

    element.resetId=function()  {
        this.elementId = View.getInstance().getUniqueId();
        this.getData().id = this.id;
        this.getExtremeIds();
    }

    element.getExtremeIds=function() {
        if ((this.m_startElementMc).elementType=="sflow") {
            this.data.setAttribute("startid", ((this.m_startElementMc).parent).getData().id);
        }else {
            this.data.startid= (this.m_startElementMc).getData().id;
        }
        if ((this.m_endElementMc).elementType=="sflow") {
            this.data.endid=((this.m_endElementMc).parent).getData().id;
        }else{
            this.data.endid= (this.m_endElementMc).getData().id;
        }
    }

    element.getVertexs=function() {
        var vertexes = [];
        var start = {x:this.m_startElementMc.x, y:this.m_startElementMc.y};
        vertexes.push(start);

        var el = this.m_startElementMc;
        var seg = this.getSegmentStartingIn(el);
        if (seg) {
            el = seg.getEndElement();
            seg = this.getSegmentStartingIn(el);
            while (el != this.m_endElementMc && seg) {
				vertexes.push({x:el.x,y:el.y})
                el = seg.getEndElement();
                seg = this.getSegmentStartingIn(el);
            }
        }
        vertexes.push({x:this.m_endElementMc.x, y:this.m_endElementMc.y});
		this.data.vertexes=vertexes;
    }
	

    element.getSegmentStartingIn=function(el) {
        for (var i = 0; i < this.lineMC.numChildren; i++ ) {
            try {
                if ((this.lineMC.getChildAt(i) ).getStartElement() == el) {
                    return (this.lineMC.getChildAt(i) );
                }
            }catch (e) {
            }
        }
        return null;
    }

    element.getStartElement=function() {
        return this.m_startElementMc;
    }

    element.getEndElement=function() {
        return this.m_endElementMc;
    }

    element.setName=function(name) {
        this.txtName.text = name;
        this.alignText();
    }

    element.alignText=function() {
		this.txtName.textAlign="center";
        this.txtName.width = 180;
        this.txtName.parent.setChildIndex(this.txtName, this.txtName.parent.numChildren - 1);
        var p = this.getMiddlePoint();
        this.txtName.y = p.y;
        var lineWidth = 180;
        var i = 0;
        while (i < this.txtName.numLines) {
            /*if (lineWidth < ((txtName.getLineMetrics(i) as TextLineMetrics).width + 5)) {
                lineWidth = (txtName.getLineMetrics(i) as TextLineMetrics).width + 5;
            }
            if (lineWidth < 100 && (txtName.getLineMetrics(i) as TextLineMetrics).width < 100) {
                lineWidth += (txtName.getLineMetrics(i) as TextLineMetrics).width + 5;
            }*/
            i++;
        }
        lineWidth = (lineWidth > 180)?180:lineWidth;
        this.txtName.width = lineWidth;
        this.txtName.x = p.x //- (lineWidth / 2);
    }

    element.setBackArrow=function(to) {
        showBack = to;
        this.setArrow();
    }

    element.setForthArrow=function(to) {
        showForth = to;
        this.setArrow();
    }


    element.callStartEndFunctions=function(action) {
        
        if(!action)
            action="add";
        
        try {
            if ((this.m_startElementMc).elementType=="gateway") {
                (this.m_startElementMc).getElement().updateExecution(action);
                (this.m_startElementMc).getElement().setReadonlyExpression(action);
            }
        }catch (e) { }
        try {
            if ((this.m_startElementMc).elementType == "startevent") {
                (this.m_startElementMc).getElement().setFirstTaskType("");
            }
        }catch (e) { }
        try {
            if ( (this.m_startElementMc).elementType == "startevent" || (this.m_startElementMc).elementType == "middleevent") {
                (this.m_startElementMc).getElement().setReadonlyNone();
            }
        }catch (e) { }
        /*try {
            if ( ((this.m_startElementMc).elementType == "middleevent") ) {
                (this.m_startElementMc).getElement().disableLineConditions();
            }
        }catch (e) { }*/
        try {
            if ( ((this.m_endElementMc).elementType == "middleevent") ) {
                (this.m_endElementMc).getElement().disableInLineConditions();
            }
        }catch (e) { }
        try {
            if ( /*((this.m_startElementMc).elementType == "middleevent")|| */ ((this.m_endElementMc).elementType == "middleevent") ) {
                var el = (((this.m_startElementMc).elementType == "middleevent")?this.m_startElementMc:this.m_endElementMc);
                if(this.elementType=="sflow" && (el.getContainer().elementType=="task" || el.getContainer().elementType=="csubflow")){
                    el.setContainer(null);
                }
            }
        }catch (e) { }
        try {
            if (this.elementType == "association") {
                var startType = (this.m_startElementMc).elementType;
                var endType = (this.m_endElementMc).elementType;
                if (startType == "textannotation" || endType == "textannotation"){ 
                    this.disableDirection();
                }else if( startType=="dataobject" || endType=="dataobject" ){
                    if (!( startType == "task" || startType == "csubflow" || endType == "task" || endType == "csubflow" ) ) { 
                        this.disableDirection();
                    }
                }
            }
			
			
			if (startType == "datainput" || endType == "dataoutput") {
				var attributes = this.getData().children[0].children;
				for (var i = 0; i < attributes.length; i++ ) {
					if (attributes[i].getAttribute("name") ==  "direction") {
						attributes[i].setAttribute("value", "From");
						attributes[i].setAttribute("type", "text");
						attributes[i].setAttribute("readonly", "true");
						break;
					}
				}
				this.setDirection("from");
			}
			
        }catch (e) { }
    }
    
    element.setDirection=function(to) {
        showForth = false;
        showBack = false;
        to = to.toLowerCase();
        if (to == "both" || to == "to") {
            showBack = true;
        }
        if (to == "both" || to == "from" || to == "one") {
            showForth = true;
        }
        this.setArrow();
        this.refreshWholeLine();
    }

    element.appear=function() {
        //this.alpha = 1;
        //Tweener.addTween(this, { alpha:1, time:.1, transition:"easeOutInBounce",onComplete:refreshWholeLine} );
    }

    

    element.setApiaType=function(type) {
        this.lineMC.alpha = 1;
        doubleArrow = false;
        this.setType("");
        if(type=="Wizard"){
            doubleArrow = true;
        }else if(type=="Loopback"){
            this.lineMC.alpha = .5;
            this.setType("dashdotted");
        }
        this.refreshWholeLine();
    }

    element.disableDirection=function() {
        var data = this.getData();
        if (data) {
            data = data.firstChild;
            for (var i = 0; i < data.children.length; i++ ) {
                if (data.children[i].attributes.name=="direction") {
                    data.children[i].attributes.type = "text";
                    data.children[i].attributes.readonly = "true";
                    data.children[i].attributes.value = "None";
                }
            }
        }
    }

    element.getLineX=function() {
        var lx = (this.m_startElementMc.x < this.m_endElementMc.x)?this.m_startElementMc.x:this.m_endElementMc.x;
        for (var i = 0; i < this.vertexMC.numChildren;i++ ) {
            if (lx > this.vertexMC.getChildAt(i).x) {
                lx = this.vertexMC.getChildAt(i).x;
            }
        }
        return lx;
    }

    element.getLineY=function() {
        var ly = (this.m_startElementMc.y < this.m_endElementMc.y)?this.m_startElementMc.y:this.m_endElementMc.y;
        for (var i = 0; i < this.vertexMC.numChildren;i++ ) {
            if (ly > this.vertexMC.getChildAt(i).y) {
                ly = this.vertexMC.getChildAt(i).y;
            }
        }
        return ly;
    }

    element.getLineWidth=function() {
        var w = this.lineMC.width+(this.m_startElementMc.width/2)+(this.m_endElementMc.width/2);
        return w;
    }

    element.getLineHeight=function() {
        var h=this.lineMC.height+(this.m_startElementMc.height/2)+(this.m_endElementMc.height/2);
        return h;
    }

    element.updateLineCorners=function() {
        if(!this.lineCornersMC.graphics)
            this.lineCornersMC.graphics=new facilis.Graphics();
        
        if(this.lineCornersMC){
            this.lineCornersMC.graphics.clear();
            this.lineCornersMC.removeAllChildren();
            this.lineCornersMC.graphics.lineStyle(LineObject.lineWidth,LineObject.lineColor);
        }
        //for (var i = 0; i < this.lineMC.numChildren; i++ ) {
        var e=this.startVertex;
        while(e && e!=this.m_endElementMc){
            //e = e.getNextElement();
            var seg1 = this.getSegmentEnding(e);
            var next = e.getNextElement();
            var seg2=this.getSegmentStarting(e);
            var sp = seg1.getEndPoint();
            //lineCornersMC.graphics.moveTo(sp.x, sp.y);
            var ep = seg2.getStartPoint();
            //lineCornersMC.graphics.lineTo(ep.x, ep.y);
            //lineCornersMC.graphics.curveTo(e.x, e.y,ep.x, ep.y);
            this.drawCorner(sp.x, sp.y, ep.x, ep.y, e.x, e.y)
            e = next;
        }
    }

    element.drawCorner=function(startx, starty, controlX, controlY,endx, endy) {
            if(this.type=="dashed"){
                facilis.LineUtils.dashCurveTo(this.lineCornersMC, startx, starty, endx, endy,controlX,controlY,3,4);
            }else if (this.type == "dotted") {
                facilis.LineUtils.dashCurveTo(this.lineCornersMC, startx, starty, endx, endy,controlX,controlY,1,4);
            }else if (this.type == "dashdotted") {
                facilis.LineUtils.dashCurveTo(this.lineCornersMC, startx, starty, endx, endy,controlX,controlY,3,4);
            }else {
                this.lineCornersMC.graphics.moveTo(startx,starty);
                this.lineCornersMC.graphics.curveTo(endx, endy,controlX, controlY);
                this.lineCornersMC.addShape(new facilis.Shape(this.lineCornersMC.graphics));
            }
    }

    element.getSegmentStarting=function(startEl){
        var seg = null;
        for (var i = 0; i < this.lineMC.numChildren; i++ ) {
            seg = this.lineMC.getChildAt(i) ;
            if(seg.getStartElement()==startEl){
                return seg;
            }
        }
        return seg;
    }

    element.getSegmentEnding=function(endEl){
        var seg = null;
        for (var i = 0; i < this.lineMC.numChildren; i++ ) {
            seg = this.lineMC.getChildAt(i) ;
            if(seg.getEndElement()==endEl){
                return seg;
            }
        }
        return seg;
    }

    element.onLineOver=function(e) {
        this.vertexMC.alpha = 1;
    }

    element.onLineOut=function(e) {
        this.vertexMC.alpha = 0;
    }
    
	element.getElement=function(){
		return this;
	}
	
    //////getters setters

    Object.defineProperty(element, 'elementId', {
        get: function() { 
            if (!this._elementId) {
                //this._elementId = View.getInstance().getUniqueId();
            }
            return this._elementId;
        },
        set: function(val){
            this._elementId=val;
        }
    });
    
    Object.defineProperty(element, 'lastElement', {
        get: function() { 
            return this.m_endElementMc;
        }
    });
    
    Object.defineProperty(element, 'startElement', {
        get: function() { 
            return this.m_startElementMc;
        }
    });
    
    Object.defineProperty(element, 'middle', {
        get: function() { 
            if (!this.middlePoint) {
                this.middlePoint = new facilis.AbstractElement();
                this.middlePoint.elementType = this.elementType;
                this.addChild(this.middlePoint);
                /*middlePoint.graphics.beginFill(0x000000, 0);
                middlePoint.graphics.drawCircle(0, 0, 2);
                middlePoint.graphics.endFill();*/
            }
            var p = this.getMiddlePoint();
            this.middlePoint.x = p.x;
            this.middlePoint.y = p.y;
            return this.middlePoint;
        }
    });
    
    Object.defineProperty(element, 'doubleArrow', {
        set: function(val) { 
            this._doubleArrow = val;
        }
    });
    
    
    
    
    facilis.LineObject = facilis.promote(LineObject, "AbstractElement");
    
}());