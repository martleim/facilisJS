(function() {

    function LaneSizers() {
        this.BaseElement_constructor();
        
        this.sizers=new facilis.BaseElement();
		
		this.lanes=[];
		this.laneHeights=[];
		
		this.laneSizers=[];
		
		this.sizing = false;
		this.actualSizer=new facilis.BaseElement();

        this.setup();
    }
    
    //static public//
    
	LaneSizers.LANE_SIZING = "LANE_SIZING";
	LaneSizers.LANE_SIZED = "LANE_SIZED";
    
    var element = facilis.extend(LaneSizers, facilis.BaseElement);
    
    
    element.setup = function() {
		this.addChild(this.sizers);
    };

    
    element.setLaneSizers = function(lns) {
        if (!this.sizing) {
            this.lanes = [];
            for (var i = 0; i < lns.length;i++ ) {
                this.lanes.push(lns[i]);
            }
            this.lanes.sort(
                function compare(a,b) {
                    if (a.y < b.y)
                        return -1;
                    
                    if (a.y > b.y)
                        return 1;
                    
                    return 0;
                }
            );//"y", Array.NUMERIC);
            this.drawSizers();
        }
    }

    element.drawSizers = function() {
        this.removeSizers();
        var w = this.parent.width;
        var h = this.parent.height;
        var lastH = 0;
        if (this.lanes.length > 1) {
            for (var i = 0; i < (this.lanes.length); i++ ) {
                var lane = (this.lanes[i]);
                if(i<(this.lanes.length-1)){
                    var laneSizer = new facilis.BaseElement();
                    laneSizer.graphics=new facilis.Graphics();
                    lastH += lane.getRealHeight();
                    w = lane.getRealWidth();
                    //this._icon.graphics.beginFill(this.topColor, 1); 
                    laneSizer.graphics.lineStyle(6,"rgba(0,0,0,.01)");
                    
                    laneSizer.graphics.lineTo(w, 0);
                    laneSizer.y = lastH;
                    laneSizer.useHandCursor = true;

                    laneSizer.graphics.lineStyle(2,"rgba(0,0,0,.8)");

                    laneSizer.graphics.moveTo(0, 0);
                    laneSizer.graphics.lineTo(w, 0);
                    //laneSizer.alpha = 0;
                    laneSizer.addShape(new facilis.Shape(laneSizer.graphics));
                    this.sizers.addChild(laneSizer);
                    this.laneSizers.push(laneSizer);
                }
                laneSizer.addEventListener("pressmove", this.sizerMouseDown.bind(this));
                laneSizer.addEventListener("pressup", this.sizerMouseUp.bind(this));
                
            }
        }
        this.setPerHeights();
    }

    element.removeSizers = function() {
		
		while(this.laneSizers.length>0){
			var laneSizer=this.laneSizers.pop();
			laneSizer.removeEventListener("pressmove", this.sizerMouseDown.bind(this));
            laneSizer.removeEventListener("pressup", this.sizerMouseUp.bind(this));
		}
		
        this.laneSizers = [];
        this.sizers.removeAllChildren();
    }

    element.dispatchLaneSizing = function(s) {
        var sizerId = 0;
        for (var i = 0; i < this.laneSizers.length; i++ ) {
            if (this.laneSizers[i] == s) {
                sizerId = i;
            }
        }
        /*if () {

        }*/
    }

    element.maxHeightPos=null;
    element.minHeightPos=null;
    element.sizerMouseDown = function(e) {
        e.stopPropagation();
        var sizer = e.currentTarget;
		var numEl = this.getIndex(sizer);

		this.sizing = true;
		
        this.actualSizer = sizer;
        sizer.alpha = .8;
        var x = 0;
        var w = 0;
        		
        y = (this.lanes[numEl]).y;
        if(!this.availableHeight){
            
			this.availableHeight = (this.lanes[numEl]).getRealHeight() + (this.lanes[numEl + 1]).getRealHeight()
			this.maxHeightPos = this.availableHeight-100;
            this.minHeightPos = (this.lanes[numEl]).y+100;
			this.availableHeight=true;
        }
        
        var p={};
        this.parent.globalToLocal(e.stageX,e.stageY,p);
        if(p.y>this.minHeightPos && p.y<this.maxHeightPos)
            sizer.y=p.y;
        
        this.dispatchEvent(new facilis.Event(facilis.LaneSizers.LANE_SIZING));
        this.y = 0;
    }

    element.sizerMouseUp = function(e) {
        e.stopPropagation();
        
        if(!this.actualSizer)
            return;
        
        var sizer = this.actualSizer;
        this.actualSizer = null;
        sizer.alpha = .1;
        /*this.stage.removeEventListener(MouseEvent.MOUSE_UP, sizerMouseUp);
        this.removeEventListener(MouseEvent.MOUSE_UP, sizerMouseUp);
        sizer.removeEventListener(MouseEvent.MOUSE_UP, sizerMouseUp);   
        sizer.stopDrag();*/
        this.y = 0;
        this.lanes.sort(function(a,b) {return a.y - b.y});
        var numEl = this.getIndex(sizer);
        var lane1 = (this.lanes[numEl]);
        var lane2 = (this.lanes[numEl + 1]);
        var totalHeight = lane1.getRealHeight() + lane2.getRealHeight();
        var oldY = 0;
        if (this.lanes[numEl-1]) {
            oldY=(this.lanes[numEl - 1]).y + (this.lanes[numEl - 1]).getRealHeight();
        }
        lane1.setSize(lane1.getRealWidth(), sizer.y - oldY);
        lane2.setSize(lane2.getRealWidth(), (totalHeight - lane1.getRealHeight()));
        lane2.y = sizer.y;
		this.availableHeight=false;
        this.sizing = false;
        this.y = 0;
        this.setPerHeights();
        this.dispatchEvent(new facilis.Event(facilis.LaneSizers.LANE_SIZED));
    }

    element.setPerHeights = function() {
        this.laneHeights = [];
        var totalH = 0;
        var lane;
        /*for (var i = 0; i < lanes.length; i++ ) {
            lane = (lanes[i]);
            totalH+=lane.getRealHeight();
        }*/
        var i = 0;
        for (i = 0; i < this.lanes.length; i++ ) {
            lane = (this.lanes[i]);
            //var h = lane.getRealHeight() / totalH;
            var h = lane.getRealHeight();
            this.laneHeights.push(h);
        }
    }

    element.setLaneHeights = function(heights) {
        this.laneHeights=heights;
    }

    element.getLaneHeights = function() {
        return this.laneHeights;
    }

    element.getIndex = function(sizer) {
        for (var i = 0; i < this.laneSizers.length;i++ ) {
            if (sizer===this.laneSizers[i]) {
                return i;
            }
        }
    }
    

    facilis.LaneSizers = facilis.promote(LaneSizers, "BaseElement");
    
}());