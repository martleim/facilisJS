(function() {

    function SwimLane() {
        this.AbstractLane_constructor();
        this._width = 0;
        this._height = 0;

    }
    
    //static public//
    
    
    var element = facilis.extend(SwimLane, facilis.AbstractLane);
    
    element.AbstractLaneSetup=element.setup;
    element.setup = function() {
        this.AbstractLaneSetup();
        this._width = 0;
        this._height = 0;
        this.redrawCube();
    };
    
    element.redrawCube=function() {
        if(!this._icon.graphics)
            this._icon.graphics=new facilis.Graphics();
        
        this._icon.removeAllChildren();
        this._icon.graphics.clear();
        
        this._icon.graphics.lineStyle(1,"#000000");
        
        this._icon.graphics.drawRect(0, 0, this._width, this._height);
        var wdth = 30;
        if (this._width<wdth+10) {
            wdth = this._width * 0.9;
        }
        this._icon.graphics.beginFill("rgba(255,255,255,.01)");
        this._icon.graphics.drawRect(0, 0, wdth, this._height);
        this._icon.graphics.endFill();
        this._icon.addShape(new facilis.Shape(this._icon.graphics));
    }


    facilis.SwimLane = facilis.promote(SwimLane, "AbstractLane");
    
}());