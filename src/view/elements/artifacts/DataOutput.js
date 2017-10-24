(function() {

    function DataOutput() {
        this.DataObject_constructor();
        
		this.subIcons;
		this.topIcons;
		
		this._curve_height = 10;
		this._line_height = 8;

        this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(DataOutput, facilis.DataObject);
    
    element.DataObjectSetup=element.setup;
    element.setup = function() {
        this.DataObjectSetup();
           
		
		this._width = 60;//70;
		this._height = 61;//64;

		this.redrawCube();
		
    };

	element.redrawBaseCube = element.redrawCube;
    element.redrawCube = function() {
        this.redrawBaseCube();
		this.typeIcon = (facilis.IconManager.getInstance().getIcon("icons.dataobjectType.DataOutput"));
		this.addTopIcon(this.typeIcon);
		this.refreshCache();
    }
	
	
	element.drawMediumLines=function() {
		var y = this._line_height + 1;

		this._icon.graphics.moveTo(0, y);

		this._icon.graphics.curveTo(this._width / 12, y + this._line_height - 2.2, this._width/2, y + this._line_height - 2);
		this._icon.graphics.curveTo(11*this._width / 12, y + this._line_height - 2.2, this._width, y);
		y += 4;

		this._icon.graphics.moveTo(0, y);
		this._icon.graphics.curveTo(this._width / 12, y + this._line_height - 2.2, this._width/2, y + this._line_height - 2);
		this._icon.graphics.curveTo(11 * this._width / 12, y + this._line_height - 2.2, this._width, y);

		y += 4;

		this._icon.graphics.moveTo(0, y);
		this._icon.graphics.curveTo(this._width / 12, y + this._line_height - 2.2, this._width/2, y + this._line_height - 2);
		this._icon.graphics.curveTo(11 * this._width / 12, y + this._line_height - 2.2, this._width, y);
	}
	
	
	
    element.positionIcons=function() {
        for (var i = 0; i < this.topIcons.numChildren;i++ ) {
            //this.topIcons.getChildAt(i).x = (this.iconSize + 1) * ( -i);
			this.topIcons.getChildAt(i).x = (this.iconSize + 1) * ( i);
        }
        i = (this.subIcons.numChildren - 1);
        for (i = (this.subIcons.numChildren - 1); i >= 0; i-- ) {
           this.subIcons.getChildAt(i).x = (this.iconSize + 1) * ( i);
        }
        this.subIcons.y = this._height - this.iconSize;
        if(this.subIcons.numChildren>0)
            this.subIcons.x = (this._width - (this.subIcons.numChildren*this.iconSize)) / 2;
        
        this.topIcons.y = 5;
        //if(this.topIcons.getBounds().width)
        //this.topIcons.x = (this._width - ((this.iconSize + 1)*this.topIcons.numChildren)) - 5;
		this.topIcons.x = 2;
        
        this.alignText();
    }

    element.addSubIcon=function(icon) {
        if (icon == null) {
            return;
        }
        this.subIcons.addChild(icon);
        icon.parent.swapChildren(icon, icon.parent.getChildAt(0));
        this.positionIcons();
    }

    element.addTopIcon=function(icon) {
        if (icon == null) {
            return;
        }
        this.topIcons.addChild(icon);
        this.positionIcons();
    }

    element.removeSubicon=function(icon) {
        if (icon && icon.parent==this.subIcons) {
            this.subIcons.removeChild(icon);
            this.positionIcons();
        }
        icon = null;
    }

    element.removeTopIcon=function(icon) {
        if (icon && icon.parent==this.topIcons) {
            this.topIcons.removeChild(icon);
            this.positionIcons();
        }
        icon = null;
    }
	
	
	element.multiIcon;
	element.typeIcon;
		
	element.setCollection=function(c) {

		if(multiIcon){
			this.removeSubIcon(multiIcon);
			this.multiIcon = null;
		}
		if(c == "true"){
			this.multiIcon = (facilis.IconManager.getInstance().getIcon("icons.loopType.MultiInstanceLoop"));
			this.addSubIcon(multiIcon);
		}
	}	
	
    element.getIntersectionWidthSegment=function(start,end){
        //this.globalToLocal(start.x,start.y,start);
        //this.globalToLocal(end.x,end.y,end);
        var ret=(this.FindPointofIntersection(start,end,new facilis.Point(0,0),new facilis.Point(this._width,0)) ||
                this.FindPointofIntersection(start,end,new facilis.Point(this._width,0),new facilis.Point(this._width,this._height)) ||
                this.FindPointofIntersection(start,end,new facilis.Point(this._width,this._height),new facilis.Point(0,this._height)) ||
                this.FindPointofIntersection(start,end,new facilis.Point(0,this._height),new facilis.Point(0,0))
                );
        //this.localToGlobal(ret.x,ret.y,ret);
        return ret;
        
    }

	
    facilis.DataOutput = facilis.promote(DataOutput, "DataObject");
    
}());