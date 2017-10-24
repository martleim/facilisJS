(function() {

    function DataObject() {
        this.SizableElement_constructor();
        
        this._icon=null;
		//var _width = 40;
		//var _height = 60;
		
		this.radius = 10;
		
		this.sizable = false;
		
		this.txtName=null;
		
		this.txt_name = "";
		this.txt_state = "";
		
		this.FONT_COLOR = "#333333";
		this.FONT_SIZE = "10";
		this.FONT_FACE = "Tahoma";
		
		this.lineWidth						= facilis.AbstractElement.lineWidth;
		this.color							= facilis.AbstractElement.color;
		this.lineColor						= facilis.AbstractElement.lineColor;

        this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(DataObject, facilis.SizableElement);
    
    element.SizableElementSetup=element.setup;
    element.setup = function() {
        this.SizableElementSetup();
        
        this._width = 40;
        this._height = 60;
		
        this._icon = new facilis.BaseElement();
        this.subIcons = new facilis.BaseElement();
        this.topIcons = new facilis.BaseElement();
        
        this.addChild(this._icon);
        this.addChild(this.topIcons);
        this.addChild(this.subIcons);
		
        this.txtName = new facilis.ElementText();
        this.addChild(this.txtName);
        
        
        this.redrawCube();
    };

    
    element.setSize = function(width, height) {
        this._width = width;
        this._height = height;
        this.redrawCube();
    }

    element.redrawCube = function() {
        this._icon.removeAllChildren();
        if(!this._icon.graphics)
            this._icon.graphics=new facilis.Graphics();
        
        this._icon.graphics.clear();
        
        this._icon.graphics.lineStyle(this.lineWidth,this.lineColor);
        
        this._icon.graphics.beginFill(this.color); 
        this.drawSheet();
        this._icon.graphics.endFill();
        this.makeDegree(this._icon);
        this.drawSheet();
        this._icon.graphics.endFill();
        
        this._icon.addShape(new facilis.Shape(this._icon.graphics));
        //_icon.graphics.drawRoundRect(0, 0, _width, _height, radius, radius);
        
        this.setCached(true);
    }

    element.drawSheet = function() {

        this._icon.graphics.moveTo(0, 0);
        this._icon.graphics.lineTo(this._width - this.radius, 0);
        this._icon.graphics.lineTo(this._width,this.radius);
        this._icon.graphics.lineTo(this._width , this._height);
        this._icon.graphics.lineTo(0, this._height);
        this._icon.graphics.lineTo(0, 0);
        this._icon.graphics.lineTo(this._width - this.radius, 0);
        this._icon.graphics.endFill(); 
        this._icon.graphics.moveTo(this._width - this.radius, 0);
        this._icon.graphics.lineTo(this._width - this.radius, this.radius);
        this._icon.graphics.lineTo(this._width, this.radius);

    }

    element.setName = function(n) {
        if(n){
            this.txt_name = n;
        }else {
            this.txt_name = "";
        }
        this.updateText();
    }

    element.setState = function(s) {
        if(s){
            this.txt_state = s;
        }else {
            this.txt_state = "";
        }
        this.updateText();
    }

    element.updateText = function() {
        var txt = this.txt_name;
        if (this.txt_state != "") {
            txt += "\n[" + this.txt_state + "]";
        }
        this.txtName.text = txt;
        /*var myformat:TextFormat = new TextFormat();
        myformat.color = FONT_COLOR;
        myformat.size = FONT_SIZE;
        myformat.font = FONT_FACE;
        myformat.align = "center";
        txtName.setTextFormat(myformat);*/
        this.alignText();

    }

    element.alignText = function() {
		this.txtName.textAlign="center";
        this.txtName.y = this._height ;
        this.txtName.width = (this._width * 2);
        this.txtName.x = (this._width/2);//-(this.txtName.width/2);
		this.refreshCache();
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
    

    facilis.DataObject = facilis.promote(DataObject, "SizableElement");
    
}());