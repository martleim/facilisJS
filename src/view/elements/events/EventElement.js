(function() {

    function EventElement() {
        this.SizableElement_constructor();
        
        this._icon=null;
		
		this.icons;
		this.typeIcon;
		
		this.eventType = "";
		
        this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(EventElement, facilis.SizableElement);
    
    element.SizableElementSetup=element.setup;
    element.setup = function() {
        this.SizableElementSetup();
        
        this.backColor = "#FFFFFF";
		this.topLineAlpha = 0;
		this.topColor = "#FFFFFF";
		
		this.txtName=null;
		
		this.FONT_COLOR = "#333333";
		this.FONT_SIZE = "10";
		this.FONT_FACE = "Tahoma";
		
		this.lineWidth						= facilis.AbstractElement.lineWidth;
		this.color							= facilis.AbstractElement.color;
		this.lineColor						= facilis.AbstractElement.lineColor;
        
        this.topColor = "#FFFFFF";
        this.backColor = "#FFFFFF";
        this.topLineAlpha = 0;
        
        this._width = 30;
        this._height = 30;
        
        this._icon = new facilis.BaseElement();
        this.icons = new facilis.BaseElement();
        
        this.addChild(this._icon);
        this.addChild(this.icons);

        this.txtName = new facilis.ElementText();
        /*txtName = new ElementText();
        txtName.autoSize = TextFieldAutoSize.CENTER;
        txtName.selectable = false;
        txtName.multiline = true;
        txtName.wordWrap = true;
        txtName.width = 1;
        txtName.height = 1;
        
        var myformat:TextFormat = new TextFormat();
        myformat.color = FONT_COLOR;
        myformat.size = FONT_SIZE;
        myformat.font = FONT_FACE;
        myformat.align = "center";
        txtName.defaultTextFormat = myformat;*/

        this.addChild(this.txtName);

        this.redrawCube();
        
    };
    
    element.setSize=function(width, height) {
        this._width = width;
        this._height = height;
        this.redrawCube();
    }
    
    element.redrawCube=function() {
        this._icon.removeAllChildren();
        if(!this._icon.graphics)
            this._icon.graphics=new facilis.Graphics();
        
        this._icon.graphics.clear();
        this._icon.graphics.beginFill(this.topColor, 1); 
        this._icon.graphics.lineStyle(this.lineWidth,this.lineColor);
        this._icon.graphics.drawCircle(this._width / 2, this._width / 2, this._width / 2);
        this._icon.graphics.endFill();

        this._icon.graphics.lineStyle(this.lineWidth, this.lineColor,this.topLineAlpha); 
        
        this._icon.graphics.beginFill(this.backColor, .9); 
        this._icon.graphics.drawCircle(this._width / 2, this._width / 2, this._width / 2);
        this._icon.graphics.drawCircle(this._width / 2, this._width / 2, (this._width * (3 / 8)));
        this._icon.graphics.endFill();

        this._icon.graphics.lineStyle(this.lineWidth, this.lineColor); 
        
        this.makeDegree(this._icon,this._height,this._height);
        this._icon.graphics.drawCircle(this._width / 2, this._width / 2, this._width / 2);
        this._icon.graphics.endFill();
        
        this._icon.addShape(new facilis.Shape(this._icon.graphics));

        this.alignText();
        //this.dispatchEvent(new Event("elementResized"));
        
        this.setCached(true);
    }

    element.typeChange=function(type) {
        eventType = type;
        var icon = "";

        switch (type){
        case "Timer":
        icon = "icons.eventType.Timer";
        break;
        case "Message":
        icon = "icons.eventType.Message";
        break;
        case "Compensation":
        icon = "icons.eventType.Compensation";
        break;
        case "Conditional":
        icon = "icons.eventType.Conditional";
        break;
        case "Link":
        icon = "icons.eventType.Link";
        break;
        case "Signal":
        icon = "icons.eventType.Signal";
        break;
        case "Multiple":
        icon = "icons.eventType.Multiple";
        break;
        case "Error":
        //icon = "icons.eventType.Error";
			if (this instanceof facilis.MiddleEventElement)
				icon = "icons.eventType.ErrorNoFill";
			else if (this instanceof facilis.EndEventElement)
				icon = "icons.eventType.ErrorFill";
			else
				icon = "icons.eventType.Error";
        break;
        case "Cancel":
        icon = "icons.eventType.Cancel";
        break;
        case "Terminate":
        icon = "icons.eventType.Terminate";
        break;
        }

        if ((type == "Message" || type == "Signal") && (this.parent).elementType=="endevent") {
            icon += "Filled";
        }

        if(this.typeIcon){
            this.icons.removeChild(this.typeIcon);
            this.typeIcon = null;
        }
        if(icon!=""){
            this.typeIcon = facilis.IconManager.getInstance().getIcon(icon);
            this.icons.addChild(this.typeIcon);
        }
        this.positionIcon();
    }

    element.catchThrowChange=function(type) {
        var icon = "";

        switch (this.eventType){
            case "Timer":
            icon = "icons.eventType.Timer";
            break;
            case "Message":
            icon = "icons.eventType.Message";
            break;
            case "Compensation":
            icon = "icons.eventType.Compensation";
            break;
            case "Conditional":
            icon = "icons.eventType.Conditional";
            break;
            case "Link":
            icon = "icons.eventType.Link";
            break;
            case "Signal":
            icon = "icons.eventType.Signal";
            break;
            case "Multiple":
            icon = "icons.eventType.Multiple";
            break;
            case "Error":
            icon = "icons.eventType.Error";
            break;
            case "Cancel":
            icon = "icons.eventType.Cancel";
            break;
            case "Terminate":
            icon = "icons.eventType.Terminate";
            break;
        }
        if (type.toLowerCase() == "throw") {
            icon += "Filled";
        }
        if(this.typeIcon){
            this.icons.removeChild(this.typeIcon);
            this.typeIcon = null;
        }
        if(icon!=""){
            this.typeIcon = facilis.IconManager.getInstance().getIcon(icon);
            this.icons.addChild(this.typeIcon);
        }
        this.positionIcon();
    }


    element.positionIcon=function() {
        element.refreshCache();
		this.icons.x = (this._width / 2)-(this.icons.getBounds().width / 2);
        this.icons.y = (this._height / 2)-(this.icons.getBounds().height / 2);
		element.refreshCache();
    }

    element.setName=function(name) {
        this.txtName.text = name;
        this.alignText();
    }

    element.alignText=function() {
        this.txtName.textAlign="center";
        this.txtName.y = this._height ;
        this.txtName.width = (this._width * 2);
         
        this.txtName.lineWidth = (this._width * 2);
        //this.txtName.height = (this._height*2);
        
        this.txtName.x = (this._width/2);
		element.refreshCache();
    }
    
    element.getIntersectionWidthSegment=function(s,e){
		
        var start=new facilis.Point(s.x,s.y);
        var end=new facilis.Point(e.x,e.y);
        
        this.globalToLocal(start.x,start.y,start);
        this.globalToLocal(end.x,end.y,end);
        
        var ret=(this.FindPointofIntersection(start,end,new facilis.Point(0,0),new facilis.Point(this._width,0)) ||
                this.FindPointofIntersection(start,end,new facilis.Point(this._width,0),new facilis.Point(this._width,this._height)) ||
                this.FindPointofIntersection(start,end,new facilis.Point(this._width,this._height),new facilis.Point(0,this._height)) ||
                this.FindPointofIntersection(start,end,new facilis.Point(0,this._height),new facilis.Point(0,0))
                );
        
        if(ret){
            this.localToGlobal(ret.x,ret.y,ret);
        }else{
            console.log("failed eventelement intersection segment");
        }
        return ret;
		/*
        var start=new facilis.Point(s.x,s.y);
        var end=new facilis.Point(e.x,e.y);
		
		this.globalToLocal(start.x,start.y,start);
        this.globalToLocal(end.x,end.y,end);
       
        var center=this._width/2;
        var size=this._width/2;
        
        var numberOfSides = 5;
        var Xcenter = this.parent.x;
        var Ycenter = this.parent.y;

        var p1=new facilis.Point(Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));
		var p2;
        var lines=[];
        for (var i = 1; i <= numberOfSides;i += 1) {
            p2=new facilis.Point(Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
			
			if(this.FindPointofIntersection(start,end,p1,p2))
                return this.FindPointofIntersection(start,end,p1,p2);
            
            p1=p2;
        }
        
        //if(ret){
        //    this.localToGlobal(ret.x,ret.y,ret);
        //}else{
            console.log("failed eventelement intersection segment");
        //}
        
        return null;*/
        
    }
    

    facilis.EventElement = facilis.promote(EventElement, "SizableElement");
    
}());