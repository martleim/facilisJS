(function() {

    function GroupLane() {
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
    
    
    var element = facilis.extend(GroupLane, facilis.AbstractLane);
    
    element.AbstractLaneSetup=element.setup;
    element.setup = function() {
        this.AbstractLaneSetup();
        
        this._width = 600;
        this._height = 300;
        this.redrawCube();
        
        
    };
    
    
    element.setName = function() {
		this.txtName.text = name;
		this.alignText();
	}

	element.alignText = function() {
		this.txtName.y = this._height - (/*this.txtText.height*/200 + 3);
		this.txtName.width = (this._width);
		this.txtName.x = (this._width/2)-(this.txtName.width/2);
	}

	element.redrawCube = function() {
		this._icon.removeAllChildren();
        if(!this._icon.graphics)
            this._icon.graphics=new facilis.Graphics();
        
        this._icon.graphics.clear();
        this._icon.graphics.lineStyle(3, "rgba(0,0,0,.01)"); 
		//_icon.graphics.beginFill(0xFFFFFF, 0); 
		this._icon.graphics.drawRect(0, 0, this._width, this._height);
		//_icon.graphics.endFill();
		this._icon.graphics.lineStyle(1.5, "rgba(60,60,60,.5)", 0.5, true, "normal", null,null, 1);
		var _radius = 15;

		facilis.LineUtils.dashDotTo(this._icon, _radius, 0,this._width - _radius, 0, 5, 10);

		this._icon.graphics.moveTo( ((this._width - _radius) + _radius / 3), 0);
		this._icon.graphics.curveTo( this._width, 0,this._width, _radius - (_radius / 3));

		facilis.LineUtils.dashDotTo(this._icon, this._width, _radius, this._width, (this._height - _radius), 5, 10);

		this._icon.graphics.moveTo( this._width,((this._height - _radius) + _radius / 3));
		this._icon.graphics.curveTo( this._width, this._height,((this._width - _radius) + _radius / 3), this._height);

		facilis.LineUtils.dashDotTo(this._icon, this._width - _radius, this._height, _radius, this._height, 5, 10);

		this._icon.graphics.moveTo( _radius - (_radius / 3), this._height );
		this._icon.graphics.curveTo( 0, this._height,0, ((this._height - _radius) + _radius / 3));

		facilis.LineUtils.dashDotTo(this._icon, 0, this._height - _radius, 0, _radius, 5, 10);

		this._icon.graphics.moveTo( 0, _radius - (_radius / 3) );
		this._icon.graphics.curveTo( 0, 0, _radius - (_radius / 3), 0);

	}

    facilis.GroupLane = facilis.promote(GroupLane, "AbstractLane");
    
}());
