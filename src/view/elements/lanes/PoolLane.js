(function() {

    function PoolLane() {
        this.AbstractLane_constructor();
        
        this._subElements;
		this.subElementsArr=[];
		this.lanesSizer;
		
		this.laneHeights=[];
		
		this.defaultMinWidth = 300;
		this.defaultMinHeight = 100;

        //this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(PoolLane, facilis.AbstractLane);
    
    element.AbstractLaneSetup=element.setup;
    element.setup = function() {
        this.AbstractLaneSetup();
        
        this._width = 600;
        this._height = 300;
        this.redrawCube();
        this._subElements = new facilis.BaseElement();
        this.addChild(this._subElements);

        facilis.View.getInstance().addEventListener(facilis.View.ON_SELECT, this.unSelectSubElements.bind(this));
        facilis.View.getInstance().addEventListener(facilis.View.VIEW_CLICK, this.unSelectSubElements.bind(this));
        facilis.View.getInstance().addEventListener(facilis.AbstractElement.ELEMENT_ADDED, this.unSelectAllSubElements.bind(this));
        
        this.lanesSizer = new facilis.LaneSizers();
        
        this.lanesSizer.addEventListener(facilis.LaneSizers.LANE_SIZED, this.laneSized.bind(this));
        this.lanesSizer.addEventListener(facilis.LaneSizers.LANE_SIZING,this.laneSizing.bind(this));
        
        this.addChild(this.lanesSizer);
        this.minHeight = this.defaultMinHeight;
        this.minWidth = this.defaultMinWidth;
        
        
    };
    
    
    
    element.redrawCube = function() {
        this.sortInnerElements();
        this._icon.removeAllChildren();
        if(!this._icon.graphics)
            this._icon.graphics=new facilis.Graphics();
        
        this._icon.graphics.clear();
        
        this._icon.graphics.lineStyle(1,"#000000");
        
        this._icon.graphics.beginFill("rgba(255,255,255,0)");
        this._icon.graphics.drawRect(0, 0, this._width, this._height);
        var wdth = 30;
        if (this._width<wdth+10) {
            wdth = this._width * 0.9;
        }
        
        this._icon.graphics.lineStyle(1,"rgba(0,0,0,0)");
        
        this._icon.graphics.drawRect(10, 10, this._width-20, this._height-20);
        this._icon.graphics.endFill();
        this._icon.graphics.beginFill("rgba(255,255,255,.1)");
        
        this._icon.graphics.lineStyle(1,"#000000");

        
        this._icon.graphics.drawRect(0, 0, wdth, this._height);
        this._icon.graphics.endFill();
            
        this._icon.addShape(new facilis.Shape(this._icon.graphics));
		this.setCached(true);
    }

    element.sortElements = function() {
        var wdth = 30;
        if (this.subElementsArr) {
            var _y = 0;
            var sumH = 0;
            for (var i = 0; i < this.subElementsArr.length; i++ ) {
                var el = (this.subElementsArr[i]);
                if (this._width < wdth + 10) {
                    wdth = this._width * 0.9;
                }
                var h = this.laneHeights[i];

                if (i==(this.subElementsArr.length-1) || (sumH+h)>this._height) {
                    h = this._height - sumH;
                }

                sumH += h;
                (this.getInnerElements()[i]).x = this.x + wdth;
                (this.getInnerElements()[i]).y = this.y + _y;
                el.y = _y;
                el.x = wdth;
                _y += h;
            }
        }
        if(this.lanesSizer){
            this.lanesSizer.x = wdth;
        }
        
        try{this.updateCache();}catch(e){}
        this.drawLaneSizers();
    }

    element.sortInnerElements = function() {
        var wdth = 30;
        if (this.subElementsArr) {
            var _y = 0;
            var sumH = 0;
            for (var i = 0; i < this.subElementsArr.length; i++ ) {
                var el = (this.subElementsArr[i]);
                if (this._width < wdth + 10) {
                    wdth = this._width * 0.9;
                }
                var h = this.laneHeights[i];

                if (i==(this.subElementsArr.length-1) || (sumH+h)>this._height) {
                    h = this._height - sumH;
                }
                el.setSize((this._width - wdth), h);
                var inner = (this.getInnerElements()[i]);
                sumH += h;
                inner.setSize((this._width - wdth), h);
                inner.x = this.x + wdth;
                inner.y = this.y + _y;
                el.y = _y;
                el.x = wdth;
                _y += h;
            }
        }
        if(this.lanesSizer){
            this.lanesSizer.x = wdth;
        }
        this.drawLaneSizers();
    }

    element.addSubElement = function(el) {
        (el).removeAllEventListenersFrom(facilis.Sizable.RESIZE_COMPLETE_EVENT);
        (el).removeAllEventListenersFrom(facilis.Sizable.RESIZE_EVENT);
        var subElement = el.getElement();
        if (!this.laneHeights) {
            this.laneHeights = [];
        }
        if (subElement.getRealHeight() != 0) {
            this.laneHeights.push(subElement.getRealHeight());
        }else {
            if (this.laneHeights.length > 0) {
                var index = this.laneHeights.length - 1;
                this.laneHeights.splice((index), 1);
                this.laneHeights.push((this.subElementsArr[(index)]).getRealHeight());
            }
            if (this.laneHeights.length == 0) {
                this.laneHeights.push(this._height);
            }else{
                this.laneHeights.push(this.defaultMinHeight);
                this._height += this.defaultMinHeight;
            }
        }
        var order = el.getData().laneOrder;
        if (order && parseInt(order) < this.subElementsArr.length) {
            var auxSubEls = this.subElementsArr.slice(0, parseInt(order));
            var auxSubEls2 = this.subElementsArr.slice(parseInt(order));
            var auxSubEls3 = [];
            auxSubEls3 = auxSubEls3.concat(auxSubEls, subElement, auxSubEls2);
            this.subElementsArr = auxSubEls3;
            this.changeInnerElementPosition((this.subElementsArr.length - 1), order);
            //this.subElementsArr.push(subElement);
        }else{
            this.subElementsArr.push(subElement);
        }
        this._subElements.addChild(subElement);
        el.removeAllEventListeners();
        
        subElement.addEventListener(facilis.AbstractElement.ELEMENT_CLICKED, this.selectSubElement.bind(this));
        subElement.addEventListener(facilis.AbstractElement.ELEMENT_CLICKED, this.stopLaneSizer.bind(this));
        
        //subElement.addEventListener(MouseEvent.MOUSE_DOWN, this.stopPropagation.bind(this));
        //subElement.addEventListener(MouseEvent.MOUSE_UP, this.stopPropagation.bind(this));
        
        el.addEventListener(facilis.Sizable.RESIZE_COMPLETE_EVENT, this.onLaneResized.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_DELETE, this.elementDeleted.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_SELECTED,this.onLaneSelected.bind(this));
        el.addEventListener(facilis.AbstractElement.ELEMENT_UNSELECTED, this.onLaneUnSelected.bind(this));
        
        this.updateParentSize();
        el.setSize(1, 1);
        el.moveTo( -900, -900);
        el.removeDropEvents();
        el.visible = false;
        this.updateMinimumSize();
    }

    element.selectSubElement = function(e) {
        //unSelectSubElements(e);
        e.stopPropagation();
        var el = e.target;
        for (var i = 0; i < this.subElementsArr.length; i++ ) {
            if (this.subElementsArr[i] == el) {
                //el.filters= [new GlowFilter(0x55FF44, 0.8, 8, 8, 2, 3, false, false)];
                (this.getInnerElements()[i]).dispatchEvent(new facilis.Event(facilis.AbstractElement.ELEMENT_CLICKED));
            }
        }
    }

    element.onLaneSelected = function(e) {
        //(e.currentTarget).getElement().filters= [new GlowFilter(0x55FF44, 0.8, 8, 8, 2, 3, false, false)];
    }

    element.onLaneUnSelected = function(e) {
        //(e.currentTarget).getElement().filters= [];
    }

    element.elementDeleted = function(e) {
        var el = e.target;
        removeElement(el);
    }

    element.removeElement = function(el) {
        var deletedPer = 0;
        var deletedH = 0;
        for (var i = 0; i < this.getInnerElements().length;i++ ) {
            if (this.getInnerElements()[i]==el) {
                var subEl = this.subElementsArr[i];
                deletedH=(subEl).getRealHeight();
                
                subEl.addEventListener(MouseEvent.CLICK, selectSubElement);
                subEl.addEventListener(MouseEvent.MOUSE_DOWN, stopPropagation);
                subEl.addEventListener(MouseEvent.MOUSE_UP, stopPropagation);
                
                deletedPer = this.laneHeights[i];
                this.laneHeights.splice(i, 1);
                this._subElements.removeChild(subEl);
                this.subElementsArr.splice(i, 1);
                this.removeInnerElementIndex(i);
                break;
            }
        }
        if(this.subElementsArr.length>0){
            this._height -= deletedH;
        }
        if (this._height<this.defaultMinHeight) {
            this._height = this.defaultMinHeight;
        }
        var newPer = [];
        var deletedHeight = this.getRealHeight() * deletedPer;
        this.updateParentSize();
        this.updateMinimumSize();
    }

    element.unSelectSubElements = function(e) {
        for (var i = 0; i < this.subElementsArr.length; i++ ) {
            var selected = false;
            for (var u = 0; u < facilis.View.getInstance().getSelectedElements().length;u++ ) {
                if (this.getInnerElements()[i]==facilis.View.getInstance().getSelectedElements()[u]) {
                    selected = true;
                }
            }
            if(!selected){
                this.subElementsArr[i].filters = [];
            }
        }
    }

    element.unSelectAllSubElements = function(e) {
        for (var i = 0; i < this.subElementsArr.length; i++ ) {
            this.subElementsArr[i].filters = [];
        }
    }

    element.stopPropagation = function(e) {
        e.stopPropagation();
    }

    element.drawLaneSizers = function() {
        if(this.lanesSizer){
            this.lanesSizer.setLaneSizers(this.subElementsArr);
        }
    }

    element.stopLaneSizer = function(e) {
        lanesSizer.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_UP));
    }

    element.laneSized = function(e) {
        this.updateLaneSizes();
        this.parent.dispatchEvent(new facilis.Event(facilis.Sizable.RESIZE_COMPLETE_EVENT));
        this.laneHeights = this.lanesSizer.getLaneHeights();
        this.updateParentSize();
        this.updateMinimumSize();
    }

    element.updateLaneSizes = function() {
        for (var i = 0; i < this.subElementsArr.length; i++ ) {
            var lane = this.subElementsArr[i];
            if (lane.getRealHeight() != this.laneHeights[i]) {
                lane.setSize(lane.getRealWidth(), this.laneHeights[i]);
            }
        }
    }

    element.laneSizing = function(e) {
        this.parent.dispatchEvent(new facilis.Event(facilis.Sizable.RESIZE_EVENT));
    }

    element.updateMinimumSize = function() {
        this.minWidth = this.defaultMinWidth;
        this.minHeight = this.defaultMinHeight;
        if (this.subElementsArr.length > 0) {
            var minH = 0;
            for (var i = 0; i < (this.subElementsArr.length-1); i++ ) {
                minH += (this.subElementsArr[i]).getRealHeight();
            }
            minH += this.defaultMinHeight;
            this.minHeight = minH;
        }
        if (this._height<this.defaultMinHeight) {
            this._height = this.defaultMinHeight;
        }
        if (this.getRealHeight() < this.minHeight) {
            var px = this.x;
            var py = this.y;
            (this.parent).setSize(this._width, this._height);
            this.x = px;
            this.y = py;
        }
        if(this.parent){
            (this.parent).centerSizableElement();
        }
    }

    element.updateParentSize = function() {
        var lanesTotalHeight = 0;
        for (var i = 0; i < this.laneHeights.length; i++ ) {
            lanesTotalHeight += parseInt(this.laneHeights[i]);
        }
        if (this._height<lanesTotalHeight) {
            this._height = lanesTotalHeight;
        }
        var px = this.x;
        var py = this.y;
        (this.parent).setSize(this._width, this._height);
        this.x = px;
        this.y = py;
    }

    element.onLaneResized = function(e) {
        e.stopPropagation();
        var totalSum = 0;
        for (var t = 0; t < this.laneHeights.length; t++ ) {
            totalSum += this.laneHeights[t];
        }
        if (totalSum == this._height) {
            for (var i = 0; i < this.subElementsArr.length; i++ ) {
                var laneHeight = (e.currentTarget).getElement().getRealHeight();
                if (this.subElementsArr[i] == (e.currentTarget).getElement() && this._height != laneHeight && laneHeight > 1) {
                    this.laneHeights[i] = laneHeight;
                }
            }
        }
        this.sortElements();
    }
    
    


    facilis.PoolLane = facilis.promote(PoolLane, "AbstractLane");
    
}());