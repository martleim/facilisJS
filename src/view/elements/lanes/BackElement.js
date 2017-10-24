(function() {

    function BackElement() {
        this.AbstractLane_constructor();
        
		this._subElements;
		this.subElementsArr=[];
		
		this.defaultMinWidth = 300;
		this.defaultMinHeight = 100;

        //this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(BackElement, facilis.AbstractLane);
    
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
        
		this._icon.removeAllChildren();
        if(!this._icon.graphics)
            this._icon.graphics=new facilis.Graphics();
        
        this._icon.graphics.clear();
		
		this._icon.graphics.lineStyle(1, 0x000000); 
		//_icon.graphics.beginFill(0xFFFFFF,0);
		this._icon.graphics.drawRect(0, 0, this._width, this._height);
		var wdth = 30;
		if (this._width<wdth+10) {
			wdth = this._width * 0.9;
		}
		//_icon.graphics.endFill();
		this._icon.graphics.drawRect(0, 0, wdth, this._height);

		this.hitArea = facilis.View.getInstance().getBack();

		this.sortInnerElements();
        
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
        if(this.subElementsArr){
			var h = this._height/this.subElementsArr.length;
			var _y = 0;
			for (var i= 0; i < this.subElementsArr.length; i++ ) {
				var el = (subElements[i]);
				var wdth = 30;
				if (this._width<wdth+10) {
					wdth = this._width * 0.9;
				}
				el.setSize((this._width - wdth), h);
				(this.getInnerElements()[i]).setSize((this._width - wdth), h);
				(this.getInnerElements()[i]).x = this.x + wdth;
				(this.getInnerElements()[i]).x = this.y + _y;
				el.y = this._y;
				el.x = wdth;
				this._y += h;
			}
		}
    }

    element.addSubElement = function(el) {
		var subElement = el.getElement();
		this.subElementsArr.push(subElement);
		this._subElements.addChild(subElement);

		subElement.addEventListener(MouseEvent.CLICK, selectSubElement);

		el.addEventListener(facilis.AbstractElement.ELEMENT_DELETE, this.elementDeleted.bind(this));

		this.sortInnerElements();
    }

    element.selectSubElement = function(e) {
        e.stopPropagation();
		var el = e.currentTarget;
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
		for (var i = 0; i < this.getInnerElements().length;i++ ) {
			if (this.getInnerElements()[i]==el) {
				var subEl = this.subElementsArr[i]
				this._subElements.removeChild(subEl);
				this.subElementsArr.splice(i, 1);
				this.getInnerElements().splice(i, 1);
				this.sortInnerElements();
			}
		}
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
    facilis.BackElement = facilis.promote(BackElement, "AbstractLane");
    
}());