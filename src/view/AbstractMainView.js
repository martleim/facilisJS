(function() {

    function AbstractMainView() {
        this.AbstractView_constructor();
    }
    
    
    var element = facilis.extend(AbstractMainView, facilis.AbstractView);
    
    element.AbstractViewSetup=element.setup;
    element.setup = function() {
        this.AbstractViewSetup();
        this._mainStage=null;
		
		this._backWidth = null;
		this._backHeight = null;
		
		this._backX = null;
		this._backY = null;
		
		this.mainPool;
		this.back;
		this.scroll;
		this.multiSelect;
		this.wasMoving;

		this.selectedElements=[];
		this.selectedLines=[];
        
    }
    
    element.init=function(s){
        
        this._mainStage = s;
        //this._stage = s;
        
        this.scroll = new facilis.ScrollContent();
        s.addChild(this.scroll);
        this._stage = this.scroll.getContent();
        
        this.initBack();
        this.scroll.updateSize(this._backWidth,this._backHeight);


        facilis.LaneView.getInstance();
        facilis.LineView.getInstance();
        facilis.ElementView.getInstance();

        facilis.ElementView.getInstance().parent.setChildIndex(facilis.ElementView.getInstance(), facilis.ElementView.getInstance().parent.numChildren - 1);

        //facilis.LaneView.getInstance().filters = [new DropShadowFilter(8, 45, Style.DROPSHADOW, .8, 10, 10, .3, 1, false)];
        //facilis.LineView.getInstance().filters = [new DropShadowFilter(8, 45, Style.DROPSHADOW, .8, 10, 10, .3, 1, false)];
        //facilis.ElementView.getInstance().filters = [new DropShadowFilter(8, 45, Style.DROPSHADOW, .8, 10, 10, .3, 1, false)];

        facilis.ElementView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_CLICK, this.onElementClick.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_CLICK, this.onElementClick.bind(this));
        facilis.LineView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_CLICK, this.onElementClick.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DOUBLE_CLICKED, this.dispatchOut.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DOUBLE_CLICKED, this.dispatchOut.bind(this));
        facilis.LineView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DOUBLE_CLICKED, this.dispatchOut.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_CLICKED, this.onElementClicked.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_CLICKED, this.onElementClicked.bind(this));
        facilis.LineView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_CLICKED, this.onLineClicked.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_OVER, this.dispatchOut.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_OVER, this.dispatchOut.bind(this));
        facilis.LineView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_OVER, this.dispatchOut.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_OUT, this.dispatchOut.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_OUT, this.dispatchOut.bind(this));
        facilis.LineView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_OUT, this.dispatchOut.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DROPIN, this.dispatchOut.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DROPIN, this.dispatchOut.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_MOVE_END, this.dispatchOut.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_MOVE_END, this.dispatchOut.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DELETE, this.dispatchOut.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DELETE, this.dispatchOut.bind(this));
        facilis.LineView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DELETE, this.dispatchOut.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DELETED, this.dispatchOut.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DELETED, this.dispatchOut.bind(this));
        facilis.LineView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DELETED, this.dispatchOut.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_MOVED, this.onElementMoved.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_MOVED, this.onElementMoved.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_MOVE_END, this.onElementMoveEnd.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_MOVE_END, this.onElementMoveEnd.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DROP, this.onElementDrop.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DROP, this.onElementDrop.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DROPIN, this.onElementDropIn.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DROPIN, this.onElementDropIn.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DROPOUT, this.onElementDropOut.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_DROPOUT, this.onElementDropOut.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_ADDED, this.dispatchOut.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_ADDED, this.dispatchOut.bind(this));

        facilis.LineView.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_ADDED, this.dispatchOut.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.Sizable.RESIZE_EVENT, this.dispatchOut.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.Sizable.RESIZE_EVENT, this.dispatchOut.bind(this));

        facilis.ElementView.getInstance().addEventListener(facilis.Sizable.RESIZE_COMPLETE_EVENT, this.dispatchOut.bind(this));
        facilis.LaneView.getInstance().addEventListener(facilis.Sizable.RESIZE_COMPLETE_EVENT, this.dispatchOut.bind(this));

        //facilis.ElementView.getInstance().stage.addEventListener(KeyboardEvent.KEY_DOWN, keyDown);
        //facilis.Key.getInstance().addEventListener(facilis.Key.KEY_DOWN, keyDown);
        
        this.zoomScroll=new facilis.ZoomScroll();
        this.mainStage.addChild(this.zoomScroll);
        this.zoomScroll.positionMe();
        this.zoomScroll.addEventListener(facilis.ZoomScroll.ON_ZOOMEND,this.onZoomed.bind(this));
    };
    
    
    
    element.initBack=function() {
        this.back = new facilis.BaseElement();
        this._stage.addChild(this.back);
        this._stage.setChildIndex(this.back,0);
        this.back.addEventListener("click", this.stageClick.bind(this) );
        window.addEventListener("resize",this.onStageResize.bind(this));
        //back.stage.addEventListener(Event.RESIZE, onStageResize);
        /*back.stage.scaleMode = StageScaleMode.NO_SCALE;
        back.stage.align = StageAlign.TOP_LEFT;*/

        this.multiSelect = new facilis.MultiSelect(this.back);
        this.back.addChild(this.multiSelect);
        this.multiSelect.addEventListener(facilis.MultiSelect.ON_SELECT, this.onMultiSelect.bind(this));
        this.multiSelect.addEventListener(facilis.MultiSelect.ON_START, this.onMultiSelectStart.bind(this));

        this.drawBack();
    }

    element.enableMultiSelect=function() {
        MultiSelect.MULTISELECT_ENABLED = true;
    }

    element.getElementsBounds=function() {
        var w=0;
        var h=0;
        var x=1000000;
        var y=1000000;
        var el;
        for (var i = 0; i < this.getElementView().getElements().length; i++ ) {
            el = (this.getElementView().getElements()[i]);
            if ((parseInt(el._width/2) + parseInt(el.x))>w) {
                w=(parseInt(el._width/2) + parseInt(el.x));
            }
            if ((parseInt(el._height/2) + parseInt(el.y)) > h) {
                h=(parseInt(el._height/2) + parseInt(el.y));
            }
            if(x<parseInt(el.x))
                x=parseInt(el.x);
                
            if(y<parseInt(el.y))
                y=parseInt(el.y);
            
        }
        i = 0;
        for (i = 0; i < this.getLaneView().getElements().length; i++ ) {
            el = (this.getLaneView().getElements()[i]);
            if (el.elementType!="swimlane" && (parseInt(el._width/2) + parseInt(el.x))>w) {
                w=(parseInt(el._width/2) + parseInt(el.x));
            }
            if (el.elementType!="swimlane" && (parseInt(el._height/2) + parseInt(el.y)) > h) {
                h=(parseInt(el._height/2) + parseInt(el.y));
            }
            if(x<parseInt(el.x))
                x=parseInt(el.x);
                
            if(y<parseInt(el.y))
                y=parseInt(el.y);
        }
        return {x:x,y:y,width:w,height:h};
    }
    
    element.getElementsWidth=function() {
        var w = 0;
        var el;
        for (var i = 0; i < this.getElementView().getElements().length; i++ ) {
            el = (this.getElementView().getElements()[i]);
            if ((parseInt(el._width/2) + parseInt(el.x))>w) {
                w=(parseInt(el._width/2) + parseInt(el.x));
            }
        }
        i = 0;
        for (i = 0; i < this.getLaneView().getElements().length; i++ ) {
            el = (this.getLaneView().getElements()[i]);
            if (el.elementType!="swimlane" && (parseInt(el._width/2) + parseInt(el.x))>w) {
                w=(parseInt(el._width/2) + parseInt(el.x));
            }
        }
        return w;
    }

    element.getElementsHeight=function() {
        var h = 0;
        var el;
        for (var i = 0; i < this.getElementView().getElements().length; i++ ) {
            el = (this.getElementView().getElements()[i]);
            if ((parseInt(el._height/2) + parseInt(el.y)) > h) {
                h=(parseInt(el._height/2) + parseInt(el.y));
            }
        }
        i = 0;
        for (i = 0; i < this.getLaneView().getElements().length; i++ ) {
            el = (this.getLaneView().getElements()[i]);
            if (el.elementType!="swimlane" && (parseInt(el._height/2) + parseInt(el.y)) > h) {
                h=(parseInt(el._height/2) + parseInt(el.y));
            }
        }
        return h;
    }

    element.getStageWidth=function() {
        return this.back.stage.canvas.width;//this.back.stage.stageWidth;
    }

    element.getStageHeight=function() {
        return this.back.stage.canvas.height;//this.back.stage.stageHeight;
    }

    element.getElementView=function() {
        return facilis.ElementView.getInstance();
    }

    element.getLineView=function() {
        return facilis.LineView.getInstance();
    }

    element.getLaneView=function() {
        return facilis.LaneView.getInstance();
    }

    element.getBack=function(){
        //return this.back.getBounds();
        return new facilis.Rectangle(0,0,this._backWidth,this._backHeight);
    }

    element._zoomed=1;
    element.zoom=function(z) {
        element._zoomed=z;
        facilis.LineView.getInstance().scale(z);
        facilis.LaneView.getInstance().scale(z);
        facilis.ElementView.getInstance().scale(z);
        /*this.back.scaleX = z;
        this.back.scaleY = z;
        this.scroll.updateSize(this._backWidth,this._backHeight);
        this.drawBack();
        var centerPoint = new facilis.Point(this._stage.stage.stageWidth / 2, this._stage.stage.stageHeight / 2);
        this.centerPoint = this.localToGlobal(centerPoint);
        this.centerPoint = facilis.ElementView.getInstance().globalToLocal(centerPoint);
        this.dispatchOut(new facilis.Event(facilis.View.ON_ZOOM));*/
    }
    
    element.resetZoom=function(){
        this.zoomScroll.resetZoom();
    }
    
    element.onZoomed=function(){
        this.drawBack();
    }

    element.keyDown=function(e) {
        if (facilis.Key.isDown(facilis.Keyboard.DELETE)	) {
            removeSelectedElements();
        }
    }

    element.removeSelectedElements=function() {
        if(!View.canDelete){return}
        var deleted = false;
        while(this.selectedElements.length!=0) {
            try {
                (this.selectedElements[0]).remove(); 
            }
            catch (e) { }
            try {
                this.selectedElements.splice(0,1);
                deleted = true;
            }
            catch (e) { }
        }
        while(selectedLines.length!=0) {
            try {
                (selectedLines[0]).remove(); 
            }
            catch (e) { }
            try {
                selectedLines.splice(0,1);
                deleted = true;
            }
            catch (e) { }
        }
        if (deleted) {
            this.dispatchEvent(new facilis.Event(facilis.View.ON_DELETE));
        }
    }

    element.isSelected=function(el) {
        if (el instanceof facilis.Element) {
            for (var i = 0; i < this.selectedElements.length; i++) {
                if ( (this.selectedElements[i]) == el) {
                    return true;
                }
            }
        }else if (el instanceof facilis.LineObject) {
            for (var u = 0; u < this.selectedLines.length; u++) {
                if ( (this.selectedLines[u]) == el) {
                    return true;
                }
            }
        }
        return false;
    }

    element.select=function(el) {
        //if (!isSelected(el)) {
            if (el instanceof facilis.Element) {
                this.selectedElements.push(el);
            }else if (el instanceof facilis.LineObject) {
                this.selectedLines.push(el);
            }
        //}
        this.dispatchEvent(new facilis.Event(facilis.View.ON_SELECT));
    }

    element.unselect=function(el) {
        if (el instanceof facilis.Element) {
            for (var i = 0; i < this.selectedElements.length; i++) {
                if ( (this.selectedElements[i]) == el) {
                    this.selectedElements.splice(i, 1);
                }
            }
        }
        if (el instanceof facilis.LineObject) {
            for (var u = 0; u < selectedLines.length; u++) {
                if ( (selectedLines[u]) == el) {
                    selectedLines.splice(u, 1);
                }
            }
        }
    }

    element.unselectAll=function() {
        while(this.selectedElements.length!=0) {
            this.selectedElements[0].unselect();
            this.selectedElements.splice(0,1);
        }
        while(this.selectedLines.length!=0) {
            (this.selectedLines[0]).unselect();
            this.selectedLines.splice(0,1);
        }
        this.selectedElements = [];
        this.selectedLines = [];
        this.dispatchEvent(new facilis.Event(facilis.View.ON_UNSELECT_ALL));
    }

    element.stageClick=function(e) {
        this.unselectAll();
        this.dispatchEvent(new facilis.Event(facilis.View.ON_SELECT));
        this.dispatchEvent(new facilis.Event(facilis.View.VIEW_CLICK));
    }

    element.getSelectedElements=function() {
        var sel = [];
        for (var i = 0; i < this.selectedElements.length;i++ ) {
            sel.push(this.selectedElements[i]);
        }
        i = 0;
        for (i = 0; i < this.selectedLines.length;i++ ) {
            sel.push(this.selectedLines[i]);
        }
        return sel;
    }

    element.onStageResize=function(e) {
        this._mainStage.canvas.width = window.innerWidth-30;
        this._mainStage.canvas.height = window.innerHeight-30; 
        this.drawBack();
        this.scroll.updateSize();
        this.zoomScroll.positionMe();
        this.dispatchEvent(new facilis.Event(Event.RESIZE));
    }
    
    element.drawBack=function() {
        if(this.back){
            this._backWidth = this.getStageWidth();
            this._backHeight = this.getStageHeight();

            var w = this._backWidth;
            var h = this._backHeight;

            var nw = this.getElementsWidth();
            if (nw > w) {
                w = nw + 20;
            }
            var nh = this.getElementsHeight();
            if (nh > h) {
                h = nh + 20;
            }
            w += 30;
            h += 30;
            if (this.mainPool) {
                this.mainPool.setSize(w, h);
                this.mainPool.moveTo(this.mainPool.width / 2, this.mainPool.height / 2);
            }
            
            
            
            if(!this.back.graphics)
                this.back.graphics=new facilis.Graphics();

            this.back.graphics.clear();
            this.back.graphics.beginFill("rgba(255,255,255,.1)");
            
            
            w=w*this._zoomed;
            h=h*this._zoomed;

            if(this._backWidth!=w || this._backHeight!=h){
                this.back.uncache();
                this._backWidth=w;
                this._backHeight=h;

                this.back.graphics.drawRect(0, 0, w, h);
                this.back.graphics.endFill();
                
                this.back.removeAllChildren();
                this.back.addShape(new facilis.Shape(this.back.graphics));
                this.back.setBounds(0,0,w,h);
                this.back.cache(0,0,w,h);
            }
        }
        this.dispatchEvent(new facilis.Event(Event.RESIZE));
    }

    element.setSize=function(w, h) {
        this._backWidth = w;
        this._backHeight = h;
    }

    element.setPosition=function(_x, _y) {
        this._backX = _x;
        this._backY = _y;
    }

    element.onElementClicked=function(e) {
        var el = e.target.dispatcher;
        if(!this.wasMoving){
            if (!facilis.Key.isDown(facilis.Keyboard.CONTROL)) {
                this.unselectAll();
            }

            if (!this.isSelected(el)) {
                el.select();
                this.select(el);
            }else {
                el.unselect();
                this.unselect(el);
            }
        }
        this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_CLICKED));
        this.wasMoving = false;
    }

    element.onElementClick=function(e) {
        var el = e.target.dispatcher;
        if (!facilis.Key.isDown(facilis.Keyboard.CONTROL) && !el.selected) {
            this.unselectAll();
        }
        this.dispatchOut(e);
    }

    element.onLineClicked=function(e) {
        var el = e.target.dispatcher;
        if (!facilis.Key.isDown(facilis.Keyboard.CONTROL)) {
            this.unselectAll();
        }
        if (!this.isSelected(el)) {
            el.select();
            this.select(el);
        }else{
            el.unselect();
            this.unselect(el);
        }
        this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_CLICKED));
    }

    element.dispatchOut=function(e) {
        e.stopPropagation();
        if(e.target && e.target.dispatcher){
            //super.dispatcherElement = e.target.dispatcher;
        }
        this.dispatchEvent(new facilis.Event(e.type));
    }

    element.onElementMoved=function(e) {
		e.stopImmediatePropagation();
        var el = e.target.dispatcher;
        for (var i = 0; i < this.selectedElements.length; i++ ) {
            var el2 = (this.selectedElements[i]);
            if(el!=el2){
                el2.moveX(el.movedX);
                el2.moveY(el.movedY);
                el2.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DRAG));
            }
        }
        if (((el).movedX != 0 && (el).movedY != 0 )) {
            this.wasMoving = true;
        }
        this.dispatchOut(e);
    }

    element.onElementMoveEnd=function(e) {
		e.stopPropagation();
        var el = e.target.dispatcher;
        for (var i = 0; i < this.selectedElements.length; i++ ) {
            if (this.selectedElements[i] != el) {
                (this.selectedElements[i]).dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DROP));
            }
        }
        this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_MOVE_END));
    }

    element.drop = null;
    element.onElementDrop=function(e) {
        e.stopPropagation();
        var v = e.target;
        this.dispatcherElement = v.dispatcher;
        //var p = new Point(dispatcherElement.x, dispatcherElement.y);
        //p = stage.globalToLocal(dispatcherElement.parent.localToGlobal(p));
        //v.addChild(dispatcherElement);
        //dispatcherElement.x = p.x;
        //dispatcherElement.y = p.y;
        drop = this.dispatcherElement;
        drop.setContainer(null);
        this.drawBack();
/*
        MapUndoHandler.a_imprimir += "Testeando trace...\n";
        MapUndoHandler.testTrace();
        MapUndoHandler.a_imprimir += "Antes de lanzar el dispatchEvent\n";
*/			
        this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DROP));
    }

    element.onElementDropIn=function(e) {
        var v = e.target;
        var container = v.dispatcher;
        if (!drop.getContainer()) {
            if(facilis.validation.RuleManager.getInstance().getDropRules().validate([container, drop])){
                drop.setContainer(container);
                //container.addContent(drop);
                this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DROP));
            }
        }
    }

    element.onElementDropOut=function(e) {
        var v = e.target;
        var droppedOut = v.dispatcher;
        if (!droppedOut.getContainer()) {
            if(facilis.validation.RuleManager.getInstance().getDropRules().validate([drop, droppedOut])){
                droppedOut.setContainer(drop);
                this.dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_DROP));
            }
        }
        //container.addContent(drop);
    }

    Object.defineProperty(element, 'dispatcher', {
        get: function() { 
            return this.dispatcherElement;;
        }
    });
    
    Object.defineProperty(element, '_stage', {
        get: function() { 
            /*if(this._mainStage)
                return this._mainStage;
            
            return this.stage;*/
            return this.scroll.getContent();
        }
    });

    element.onMultiSelectStart=function(e) {
        if(!facilis.Key.isDown(facilis.Keyboard.CONTROL)){
            this.unselectAll();
        }
    }

    element.onMultiSelect=function(e) {
        var rect = multiSelect.selectionRectangle;
        var els = facilis.ElementView.getInstance().getElements();
        els = els.concat(facilis.LineView.getInstance().getElements());
        els = els.concat(facilis.LaneView.getInstance().getElements());
        var sP = new Point(rect.x, rect.y);
        var eP = new Point(rect.width + rect.x, rect.height + rect.y);
        sP = multiSelect.localToGlobal(sP);
        eP = multiSelect.localToGlobal(eP);
        sP = facilis.ElementView.getInstance().globalToLocal(sP);
        eP = facilis.ElementView.getInstance().globalToLocal(eP);
        var selRect = new facilis.Rectangle(sP.x, sP.y, Math.abs(eP.x - sP.x), Math.abs(eP.y - sP.y));
        var swimLanes = [];
        var selectSwimlanes = false;
        for (var i = 0; i < els.length; i++ ) {
            if (els[i] instanceof facilis.LineObject) {
                var segs = (els[i]).getSegments();
                for (var n = 0; n < segs.length; n++ ) {
                    var sp = (segs[n]).getStartPoint();
                    var ep = (segs[n]).getEndPoint();
                    sp = segs[n].localToGlobal(sp);
                    ep = segs[n].localToGlobal(ep);
                    sp = facilis.ElementView.getInstance().globalToLocal(sp);
                    ep = facilis.ElementView.getInstance().globalToLocal(ep);
                    /*var lx = (sp.x < ep.x)?sp.x:ep.x;
                    var ly = (sp.y < ep.y)?sp.y:ep.y;
                    var lw = Math.abs(ep.x - sp.x);
                    var lh = Math.abs(ep.y - sp.y);
                    lw = (lw > 0)?lw:2;
                    lh = (lh > 0)?lh:2;

                    var lineRect=new facilis.Rectangle(lx, ly, lw, lh);
                    if(  selRect.intersects(lineRect)  ){*/
                    var seg = new facilis.Segment(sp, ep);
                    if(seg.intersects(selRect)){
                        (els[i]).select();
                        select(els[i]);
                        break;
                    }
                }
            }else {
                if (selRect.intersects(getElementRectangle(els[i]))) {
                    (els[i]).select();
                    select(els[i]);
                    if ((els[i]).elementType == "pool") {
                        selectSwimlanes = true;
                    }
                }
                if ( (els[i]).elementType == "swimlane") {
                    swimLanes.push( (els[i]) );
                }
            }
        }
        if (selectSwimlanes) {
            for (var s = 0; s < swimLanes.length; s++ ) {
                (swimLanes[s]).select();
                select(swimLanes[s]);
            }
        }
    }

    element.getElementRectangle=function(el) {
        var elx = (el.x - (el.width / 2));
        var ely = (el.y - (el.height / 2));
        return new facilis.Rectangle(elx,ely,el.width,el.height);
    }

    
    

    facilis.AbstractMainView = facilis.promote(AbstractMainView, "AbstractView");
    
}());