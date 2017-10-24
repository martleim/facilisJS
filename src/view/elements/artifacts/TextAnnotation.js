(function() {

    function TextAnnotation() {
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
    
    
    var element = facilis.extend(TextAnnotation, facilis.SizableElement);
    
    element.SizableElementSetup=element.setup;
    element.setup = function() {
        this.SizableElementSetup();
        
        this._width = 40;
        this._height = 20;
        this._icon = new facilis.BaseElement();
        this.addChild(this._icon);

        this.txtText = new facilis.ElementText();
        /*txtText.selectable = false;
        txtText.multiline = true;
        txtText.wordWrap = true;

        var myformat:TextFormat = new TextFormat();
        myformat.color = FONT_COLOR;
        myformat.size = FONT_SIZE;
        myformat.font = FONT_FACE;
        myformat.align = "center";
        txtText.defaultTextFormat = myformat;
        */
        this.addChild(this.txtText);

        this.redrawCube();
        
    } ;

    
    
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
        
        this._icon.graphics.lineStyle(1,"rgba(0,0,0,.1)");
        
        this._icon.graphics.beginFill("#EAEAEA", 0.1);
        this._icon.graphics.drawRoundRect(0, 0, this._width, this._height, this.radius, this.radius);
        this._icon.graphics.endFill();
        
        this._icon.graphics.lineStyle(1.2,"rgba(0,0,0,.5)");
        
        
        this._icon.graphics.moveTo(this._width/2, this._height);
        this._icon.graphics.lineTo(0, this._height);
        this._icon.graphics.lineTo(0, 0);
        this._icon.graphics.lineTo((this._width / 2), 0);


        this._icon.addShape(new facilis.Shape(this._icon.graphics));
			
        this.alignText();
        //_icon.graphics.drawRoundRect(0, 0, _width, _height, radius, radius);
        
        this.setCached(true);
    }
    
    
    
    element.setText=function(text) {
        this.txtText.text = text;
        /*var myformat:TextFormat = new TextFormat();
        myformat.color = FONT_COLOR;
        myformat.size = FONT_SIZE;
        myformat.font = FONT_FACE;
        myformat.align = "center";
        txtText.setTextFormat(myformat);*/
        this.alignText();
    }

    element.alignText=function() {
        this.txtText.y = 0;
        this.txtText.width = this._width;
        this.txtText.height = this._height;
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

    facilis.TextAnnotation = facilis.promote(TextAnnotation, "SizableElement");
    
}());